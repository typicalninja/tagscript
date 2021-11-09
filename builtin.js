const { regex } = require('./constants.js');
const { stripIndents, cleanString } = require('./utils.js');
// provides maths functions
const Parser = require('expr-eval').Parser;
const math = new Parser();
const {VM} = require('vm2');
// used to execute if statements
const exec = new VM();
const util = require('util');

module.exports.variables = {
	version: process.version,
}

module.exports.functions = {
	math: (_, args) => {
		if(args.length > 1) {
			const joined = args.join(' ')
			try { return math.evaluate(joined) } catch { return '' }
		}
		else if(args[0]) {
			try { return math.evaluate(args[0]) } catch { return '' }
		}
	},
	range: (_, args) => {
		const max = parseInt(args[1]) || 10;
		const min = parseInt(args[0]) || 0;
		if(isNaN(max) || isNaN(min)) return '';

		return Math.floor(Math.random() * (max - min) ) + min
	},
	choose: (_, args) => {
		return args[Math.floor(Math.random() * args.length)]
	},
}

const features = {
	defineVariable: async (ctx, variable, value) => {
		value = stripIndents(value);
		variable = stripIndents(variable);
		if(ctx.variables[value]) {
			value = ctx.variables[value]
		}
		if(features.isFunction(value)) {
				value = await features.callFunction(value, ctx)
		}
		// a function is assigned to a variable
		if(ctx.functions[value] && !features.isFunction(value)) {
			ctx.functions[variable] = ctx.functions[value]
			// update the vm so that the new function is available
			features.updateVM(ctx);
			return '';
		}
		else {
			// variable reassigning is possible
			ctx.variables[variable] = value;
			// update the vm so that the new variable is available
			features.updateVM(ctx);
			return '';
		}
	},
	parseType: (tag) => {
		return regex.ifCondition.test(tag) ? 'IF' : features.isFunction(tag) ? 'FUNCTION' : regex.variableDeclaration.test(tag) ? 'VARIABLE_DECLARATION' : 'UNKNOWN';
	},
	isFunction: (string) => regex.function.test(string),
	isVariableDeclaration: (s) => regex.variableDeclaration.test(s),
	getDeclaration: (s) => {
		const dec = s.split('=');
		return { variableName: dec[0], value: dec[1] };
	},
	getData: (tag) => {
		tag = stripIndents(tag);
		const type = features.parseType(tag);
		let data = {};
		if(type === 'FUNCTION') {
			data = {
				functionName: tag,
			}
		}
		else if(type === 'VARIABLE_DECLARATION') {
			const variableData = features.getDeclaration(stripIndents(tag));
			data = {
				variableName: variableData.variableName,
				value: variableData.value
			}
		}
		else if(type === 'IF') {
			//const formatted = tag.split(":").slice(1).join('').replace(/\n/g, '').split(';');
			const _ifClause = tag.match(/^if\([^)]*\):\s*.*?\s*:/gis);
			const elseIF = tag.match(/else if\([^)]*\):\s*.*?\s*:/gis);
			const _else = tag.match(/else:\s*.*?\s*:/gis);
		
			
			// code of above statements
			const ifCode = _ifClause[0].match(/:(.*?):/gis);
			const elseIfCode = elseIF ? elseIF[0].match(/:(.*?):/gis) : [];
			const elseCode = _else ? _else[0].match(/:(.*?):/gis) : [];

			data = {
				full: cleanString(tag),
				code: {
					if: {
						ifCode: ifCode[0] ? ifCode[0].slice(1, -1).split(';')?.map(c => cleanString(c)).filter(c => c) : null,
						condition: cleanString(_ifClause[0].match(regex.condition)[0]?.slice(1, -1)),
					},
					elseIf: {
						elseIfCode: elseIfCode ? elseIfCode[0]?.slice(1, -1).split(';')?.map(c => cleanString(c)).filter(c => c) : null,
						condition: elseIF ? cleanString(elseIF[0]?.match(regex.condition)[0]?.slice(1, -1)) : null,
					},
					else: {
						elseCode: elseCode[0] ? elseCode[0]?.slice(1, -1).split(';')?.map(c => cleanString(c)).filter(c => c) : null,
					}
				},
			}
			if(!elseIF) Object.defineProperty(data.code, 'elseIf', { value: null });
			if(!_else) Object.defineProperty(data.code, 'else', { value: null });
		}
		else {
			data = { variableName: tag }
		}
		return { type: type, data: data };
	},
	callFunction: async (functionTag, ctx = {}) => {
		if(features.isFunction(stripIndents(functionTag))) return undefined;
		const { functionName, functionArguments } = await features.getFunction(functionTag, ctx);
		if(!ctx.functions[functionName]) return undefined;
		const func = ctx.functions[functionName];
		try { 
			if(util.types.isAsyncFunction(func)) {
				return await func(ctx, functionArguments);
			}
			else {
				return func(ctx, functionArguments);
			}
		 } catch { return undefined;}
	},
	// gets functions args and name sorted
	getFunction: async (functionTag, ctx) => {
		const functionName = functionTag.substring(0, functionTag.indexOf('('))
		const functionArguments = functionTag.substring(functionTag.indexOf('(') + 1, functionTag.lastIndexOf(')'))
		const functionArgumentsArray = functionArguments.split(',');
		const functionArgumentsNames = await Promise.all(functionArgumentsArray.map(async (argument) => {
			argument = stripIndents(argument);
			if(ctx.variables[argument]) return ctx.variables[argument];
			else if(features.isFunction(argument)) {
				if(util.types.isAsyncFunction(func)) {
					return await features.callFunction(argument, ctx);
				}
				else {
					return features.callFunction(argument, ctx);
				}
			}
			else return argument;
		}));
		return {
			functionName: stripIndents(functionName),
			functionArguments: functionArgumentsNames
		}
	},
	updateVM: (ctx) => {
		const obj = {
			...ctx.variables,
			...ctx.functions,
		}
		exec.setGlobals(obj);
		return obj;
	},
	// needs additional parser value
	callIF: (conditionData, ctx, parser) => {
		let conditionResult;
		try {
			conditionResult = exec.run(conditionData.code.if.condition);
		} catch { conditionResult = false; }
		if(!conditionResult) {
			conditionResult = false;
			if(conditionData.code.elseIf) {
				try {
					conditionResult = exec.run(conditionData.code.elseIf.condition);
				} catch { conditionResult = false; }
			}

			if(conditionResult) {
				let code = conditionData.code.elseIf.elseIfCode;
				// we use Parser.parseString so the code needs to be inside {}
				const mapped = code.map(c => `{${c}}`).join('\n')
				return parser.parseString(mapped, ctx);
			}
			else if(!conditionResult && conditionData.code.else) {
				let code = conditionData.code.else.elseCode;
					// we use Parser.parseString so the code needs to be inside {}
					const mapped = code.map(c => `{${c}}`).join('\n')
					return parser.parseString(mapped, ctx);
			}
		}
		// condition is true, execute code inside the IF

		let code = conditionData.code.if.ifCode;
		// we use Parser.parseString so the code needs to be inside {}
		const mapped = code.map(c => `{${c}}`).join('\n')
		return parser.parseString(mapped, ctx);
	},
}

module.exports.features = features;