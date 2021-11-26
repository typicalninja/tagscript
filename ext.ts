/**
 * Manage extensions / additional functions
 */
import { Parser } from "."
const { version } = require('./package.json');
import util from 'util';

const Functions: { [key: string]: (ctx: any, args: any[]) => string } = {
	choose: (_: any, args: any[]) => {
		return util.inspect(args[Math.floor(Math.random() * args.length)])
	}
}

const Variables: { [key: string]: string | {} } = {
	version: version,
	process: {
		version: process.version,
	}
}


const applyFunctions = (functions: string[], parser: Parser) => {
	 if(!Array.isArray(functions)) throw new Error('Functions must be a Array');
	 if(!(parser instanceof Parser)) throw new Error('Parser Must be a InstanceOf a Parser');
	 return functions.forEach((func: string) => {
		if(Functions[func]) parser.addVariable(func, Functions[func])
	 });
}

const applyVariables = (variables: string[], parser: Parser) => {
		if(!Array.isArray(variables)) throw new Error('Variables must be a Array');
		if(!(parser instanceof Parser)) throw new Error('Parser Must be a InstanceOf a Parser');
		return variables.forEach((variable) => {
			if(Variables[variable]) parser.addVariable(variable, Variables[variable])
		})
}

const applyExt = (modules: string[], parser: Parser) => {
	if(!Array.isArray(modules)) throw new Error('Modules must be a Array');
	if(!(parser instanceof Parser)) throw new Error('Parser Must be a InstanceOf a Parser');
	const variables = modules.filter(m => Variables[m]);
	const functions = modules.filter(m => Functions[m])

	if(variables.length) applyVariables(variables, parser)
	if(functions.length) applyFunctions(functions, parser)

	return parser
}

export default applyExt;