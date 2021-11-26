/**
 * Manage extensions / additional functions
 * Now globalCtx is empty without functions by default
 */
import { Parser } from "."
import { version } from './package.json'


const Functions: { [key: string]: (ctx: any, args: any[]) => string } = {
	choose: (_: any, args: any[]) => {
		return String(args[Math.floor(Math.random() * args.length)])
	},

}

const Variables: { [key: string]: string | {} } = {
	version: version,
	process: {
		version: process.version,
		arch: process.arch
	}
}


const applyFunctions = (parser: Parser, functions: string[]) => {
	 if(!Array.isArray(functions)) throw new Error('Functions must be a Array');
	 if(!(parser instanceof Parser)) throw new Error('Parser Must be a InstanceOf a Parser');
	 return functions.forEach((func: string) => {
		if(Functions[func]) parser.addVariable(func, Functions[func])
	 });
}

const applyVariables = (parser: Parser, variables: string[]) => {
		if(!Array.isArray(variables)) throw new Error('Variables must be a Array');
		if(!(parser instanceof Parser)) throw new Error('Parser Must be a InstanceOf a Parser');
		return variables.forEach((variable) => {
			if(Variables[variable]) parser.addVariable(variable, Variables[variable])
		})
}

/**
 * apply default functions and variables to the parser
 * as they are no longer provided in the default parser
 * @param parser - parser to apply these to
 * @param modules - module names to apply
 * @returns 
 * @example
 * ```ts
 * // typescript
 * import { addDefaults } from '@typicalninja/tagscript';
 * 
 * const parser = ...parser code here
 * 
 * addDefaults(parser, [
 * 	'random',
 *   'version'
 *  ])
 * ```
 * @example
 * ```
 * Current modules:
 * Variables:
 * 
 * version - version of tagscript
 * process - process : (.version - version of node.js, .arch - value of process.arch)
 * 
 * functions:
 * 
 * choose - random item from args
 * 
 * ```
 */
const applyExt = (parser: Parser, modules: string[]) => {
	if(!Array.isArray(modules)) throw new Error('Modules must be a Array');
	if(!(parser instanceof Parser)) throw new Error('Parser Must be a InstanceOf a Parser');
	const variables = modules.filter(m => Variables[m]);
	const functions = modules.filter(m => Functions[m])

	if(variables.length) applyVariables(parser, variables)
	if(functions.length) applyFunctions(parser, functions)

	return parser
}

export default applyExt;