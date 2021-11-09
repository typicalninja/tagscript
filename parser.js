const { merge, isString, stripIndents } = require('./utils.js');
const constants = require('./constants.js');
const builtIn = require('./builtin.js');

/**
 * The main parser class.
 * @
 */
class Parser {
	constructor(options = {}) {
		this.options = merge(constants.defaultOptions, options);
		this.ctx = this.options.ctx
	}
	static async parseString(string, ctx) {
		const parsedTags = string.match(constants.regex.main)
		// no tags found in the string, return the string as it is
		if(!parsedTags) return string;
		// tags found, parse them
		// we modify this in a for loop, and return this modified string
		let finalTag = string;
		for(const Tag of parsedTags) {
			let tag = Tag.slice(1, -1);
			// strip extra spaces so name does not get messed up in the context
			tag = stripIndents(tag);
			// get the types and its data from the tag
			const { data, type } = builtIn.features.getData(tag);
			// its a variable declaration
		 	if (type == 'VARIABLE_DECLARATION') {
				await builtIn.features.defineVariable(ctx, data.variableName, data.value)
				finalTag = finalTag.replace(Tag, '');
			// its a function
			} else if(type === 'FUNCTION') {
				const functionData = await builtIn.features.callFunction(data.functionName, ctx)
				// if function returns a string, we replace the tag with the string
				if(functionData) {
					finalTag = finalTag.replace(Tag, functionData);
				}
				// if not, we replace the tag with nothing (empty string)
				else {
					finalTag = finalTag.replace(Tag, '');
				}
			}
			// its a if
			else if(type === 'IF') {
				const ifData = await builtIn.features.callIF(data, ctx, Parser);
				if(ifData) {
					finalTag = finalTag.replace(Tag, ifData);
				}
				else {
					finalTag = finalTag.replace(Tag, '');
				}
			}
			// might be a variable, check isString is there just incase, but does not do much
			else if(!isString(Tag)) {
				if(ctx.variables[Tag.slice(1, -1)]) {
					finalTag = finalTag.replace(Tag, ctx.variables[Tag.slice(1, -1)]);
				}
			}
		}
		// strip all the whitespace and beautify the string and return it
		return stripIndents(finalTag);
	}
	getNewCtx(additionalCtx = {}) {
		const newCtx = merge({
			functions: {...builtIn.functions},
			variables: {...builtIn.variables}
		}, additionalCtx);
		const ctx = merge(this.ctx, newCtx);

		return {
			ctx: ctx,
			addVariable: (name, value) => {
				ctx.variables[name] = value;
			},
			addFunction: (name, func) => {
				if(typeof func !== 'function') {
					throw new Error('Function must be a function');
				}
				ctx.functions[name] = func;
			},
			parse: (string) => Parser.parseString(string, ctx)
		}
	} 
}

module.exports = Parser;