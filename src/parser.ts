import { defaultOptions } from './internal/constants';
import { merge } from './internal/utils';
import { default as Data_gen } from './internal/dat.gen'
import { ValidationError } from './internal/errors';
import Runner from './internal/runner';



interface parserOption {
	globalCtx: {
		functions: Record<string, Function>;
		variables: Record<string, string | undefined>;
	},
	/**
	 * Errors thrown will be forwarded and not get replaced by a empty string
	 */
	throwError: boolean,
}


class Parser {
	options: parserOption
	globalCtx: { functions: Record<string, Function>; variables: Record<string, string | undefined> }
	constructor(options: parserOption) {
		this.options = merge(defaultOptions, options || { globalCtx: { functions: {}, variables: {} } });
		this.globalCtx = this.options.globalCtx
	}
	throwError(msg: string) {
		if(this.options.throwError == true) {
			throw new Error(msg)
		}

		return '';
	}
	addFunction(name: string, func: Function, ctx = this.globalCtx): Parser {
		if(typeof name !== 'string') throw new ValidationError('addGlobalFunction()', 'name must be a string');
		if(typeof func !== 'function') throw new ValidationError('addGlobalFunction()', 'func must be a function');
		Object.defineProperty(ctx.functions, name, {
					value: func,
					writable: true,
					enumerable: true
		});
		return this;
	}
	addVariable(name: string, value: any, ctx = this.globalCtx): Parser {
		if(typeof name !== 'string') throw new ValidationError('addGlobalVariable()', 'name must be a string');
		Object.defineProperty(ctx.variables, name, {
			value: value,
			writable: true,
			enumerable: true
		})
		return this;
	}
	addFunctions(funcs: {name: string, func: Function}[], ctx = this.globalCtx) {
		if(!Array.isArray(funcs)) throw new ValidationError('addGlobalFunctions()', 'funcs must be an array');
		funcs.forEach(({name, func}, int) => {
			try {
				this.addFunction(name, func, ctx)
			}
			catch(err) {
				throw new ValidationError(`addGlobalFunctions()`, `Error with Func at index: ${int} [${err}]`)
			}
		});

		return this;
	}
	getNewCtx(additionalCtx = {}) {
		const ctx = merge(this.globalCtx, additionalCtx);
		return {
			addFunction: (name: string, func: Function) => this.addFunction(name, func, ctx),
			addVariable: (name: string, value: any) => this.addVariable(name, value, ctx),
			parse: (str: string) => Parser.parse(str, ctx, this)
		}
	}
	public static async parse(str: string, ctx: object, thisContext: Parser) {
		if(typeof str !== 'string') throw new ValidationError('parse()', 'str must be a string');
		const original = str;
		const data = Data_gen(str);
		return await (new Runner(data, ctx, original, thisContext)).run()
	}
}

export default Parser