import { defaultOptions } from './internal/constants';
import { merge } from './internal/utils';
import { default as Data_gen } from './internal/dat.gen'
import { ValidationError } from './internal/errors';
import Runner from './internal/runner';



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
		variables.forEach(({ name, value }) => {
			this.addVariable(name, value, ctx)
		})
	}
	removeVariable(name: string, ctx = this.globalCtx) {
		delete ctx[name]
		return ctx;
	}
	getNewCtx(additionalCtx = {}) {
		const ctx = merge(this.globalCtx, additionalCtx);
		return {
			addVariable: (name: string, value: string | Function) => this.addVariable(name, value, ctx),
			removeVariable: (name: string) => this.removeVariable(name, ctx),
			getVar: (name: string) => ctx[name],
			parse: (str: string) => Parser.parse(str, ctx, this)
		}
	}
	public static async parse(str: string, ctx: { [key: string]: string }, thisContext: Parser) {
		if(typeof str !== 'string') throw new ValidationError('parse()', 'str must be a string');
		const original = str;
		const data = Data_gen(str);
		return await (new Runner(data, ctx, original, thisContext)).run()
	}
}

export default Parser