import { defaultOptions } from './internal/constants';
import { merge } from './internal/utils';
import { default as Data_gen } from './internal/dat.gen'
import { ValidationError } from './internal/errors';
import Runner from './internal/runner/runner';

interface parserOption {
	globalCtx: {
		[key: string]: string
	},
	/**
	 * Errors thrown will be forwarded and not get replaced by a empty string
	 */
	throwError: boolean,
}


class Parser {
	options: parserOption
	globalCtx: {
		[key: string]: string
	}
	constructor(options: parserOption) {
		this.options = merge(defaultOptions, options || { globalCtx: { }, throwError: false });
		this.globalCtx = this.options.globalCtx
	}
	throwError(msg: string) {
		if(this.options.throwError == true) {
			throw new Error(msg)
		}

		return '';
	}
	addVariable(name: string, value: any, ctx = this.globalCtx): Parser {
		// var names are always strings, value can be anything
		if(typeof name !== 'string') throw new ValidationError('addGlobalVariable()', 'name must be a string');
		Object.defineProperty(ctx, name, {
			value: value,
			writable: true,
			enumerable: true,
			configurable: true,
		})
		return this;
	}
	addVariables(variables: {name: string, value: string}[], ctx = this.globalCtx) {
		if(!Array.isArray(variables)) throw new ValidationError('addVariables()', 'variables must be an array');
		return variables.forEach(({ name, value }) => {
			// var names are always strings, value can be anything
			if(typeof name !== 'string') throw new ValidationError('addVariables()', `Error while adding var: ${name}, var names must be strings`)
			return this.addVariable(name, value, ctx)
		});
	}
	removeVariable(variable: string, ctx = this.globalCtx) {
		if(typeof variable !== 'string') throw new ValidationError('removeVariable()', 'variable must be a string')
		delete ctx[variable]
		return ctx;
	}
	removeVariables(variables: string[], ctx = this.globalCtx) {
		if(!Array.isArray(variables)) throw new ValidationError('removeVariables()', 'variables must be a array')
		return variables.forEach((variable) => {
			// variable names must be strings
			if(typeof variable !== 'string') return;
			delete ctx[variable]
			return ctx;
		});
	}
	getNewCtx(additionalCtx = {}) {
		// merge the new user provided ctx with global old ctx
		const ctx = merge(this.globalCtx, additionalCtx);
		// additional functions to Customize / use this new ctx
		return {
			// Add's a variable (to this new ctx)
			addVariable: (name: string, value: string | Function) => this.addVariable(name, value, ctx),
			// Removes a variable (from this new ctx)
			removeVariable: (name: string) => this.removeVariable(name, ctx),
			// Add's multiple variable's (to this new ctx)
			addVariables: (variables: {name: string, value: string}[]) => this.addVariables(variables, ctx),
			// Removes multiple variable's (from this new ctx)
			removeVariables: (variables: string[]) => this.removeVariables(variables, ctx),
			// get a variable that got defined earlier
			getVar: (name: string) => ctx[name],
			parse: (str: string) => Parser.parse(str, ctx, this),
			// expose the new ctx we got
			ctx: ctx
		}
	}
	public static async parse(str: string, ctx: { [key: string]: string }, thisContext: Parser) {
		if(typeof str !== 'string') throw new ValidationError('parse()', 'str must be a string');
		const original = str;
		const data = Data_gen(str);
		// start a new Runner and run it 
		return await (new Runner(data, ctx, original, thisContext)).run()
	}
}

export default Parser