import { defaultOptions } from './internal/constants';
import { merge } from './internal/utils';
import { ValidationError } from './internal/errors';
import { default as getStaticProps } from './internal/static/staticprops';
import InterPreter from './internal/interpreter/interpreter';
import ExtensionManager from './internal/extensions/extensions';

interface parserOptions {
	globalCtx: {
		[key: string]: string
	},
	/**
	 * Errors thrown will be forwarded and not get replaced by a empty string
	 */
	throwError: boolean,
}

/**
 * Main parser
 * @param options - options for the parser
 */
class Parser {
	options: parserOptions
	globalCtx: {
		[key: string]: string
	}
	extensionManager: ExtensionManager;
	constructor(options: parserOptions) {
		/**
		 * Options for the parser
		 */
		this.options = merge(defaultOptions, options || { globalCtx: { }, throwError: false });
		/**
		 * Global context, stores variables / functions that are global
		 */
		this.globalCtx = this.options.globalCtx

		this.extensionManager = new ExtensionManager(this);
	}
	/**
	 * Utility to throw a Error if user enabled throwError option
	 * @param msg - message to throw as Error
	 * @example
	 * ```ts
	 * parser.throwError('A Error occurred While parsing this string')
	 * ```
	 */
	throwError(msg: string) {
		if(this.options.throwError == true) {
			throw new Error(msg)
		}
		// return '' if its not enabled
		return '';
	}
	/**
	 * Add's a variable to the (global / given) context
	 * @param name - name of the variable
	 * @param value - value representing this variable
	 * @param ctx - context to add this variable to, default to global context
	 * @returns 
	 * @example
	 * ```ts
	 * parser.addVariable('variable', 'string');
	 * ```
	 * @example
	 * ```ts
	 * parser.addVariable('variable', (ctx, args) => `Function contains ${args.length} arguments (which are ${args.join(', ')})`)
	 * ```
	 */
	addVariable(name: string, value: any, ctx = this.globalCtx): Parser {
		// var names are always strings, value can be anything even null and undefined
		if(typeof name !== 'string') throw new ValidationError('addGlobalVariable()', 'name must be a string');
		Object.defineProperty(ctx, name, {
			value: value,
			writable: true,
			enumerable: true,
			configurable: true,
		})
		return this;
	}
	/**
	 * Add's multiple variables to (global / given) context
	 * @param variables - variables to add
	 * @param ctx - context to add these variables to, default to global context
	 * @example
	 * ```ts
	 * parser.addVariables([
	 *  { name: 'variable1', value: 'string' },
	 *  { name: 'variable2', value: (ctx, args) => `Function contains ${args.length} arguments (which are ${args.join(', ')})`  }
	 * ])
	 * ```
	 */
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
	/**
	 * returns a context that inherits global context values but is different from the global context, anything added to this new context will only affect that context
	 * @param additionalCtx - new context to merge with global 
	 * @returns 
	 * @example
	 * ```ts
	 * const ctx = parser.getNewCtx({
	 *  variable: 'value'
	 * });
	 * 
	 * ctx.getVar('variable');
	 * 
	 * ctx.parse('script').then(console.log)
	 * ```
	 */
	getNewCtx(additionalCtx = {}) {
		// merge the new user provided ctx with global old ctx
		const ctx = merge(this.globalCtx, additionalCtx);
		// additional functions to Customize / use this new ctx
		return {
			/**
			 * Add's a variable (to this new ctx)
			 * @param name - variable to add
			 * @param value - value of the variable
			 * @returns 
			 * @example
			 * ```ts
			 * ctx.addVariable('variable2', 'string variable')
			 * ```
			 * @example
			 * ```ts
			 * ctx.addVariable('variable3', () => 'function variable')
			 * ```
			 */
			addVariable: (name: string, value: string | Function) => this.addVariable(name, value, ctx),
			/**
			 * Removes a variable (from this new ctx)
			 * @param name - variable to remove
			 * @returns 
			 * @example
			 * ```ts
			 * ctx.removeVariable('variable2')
			 * ```
			 */
			removeVariable: (name: string) => this.removeVariable(name, ctx),
			/**
			 * Add's multiple variable's (to this new ctx)
			 * @param variables - variables to add
			 * @returns
			 * @example
			 * ```ts
			 * ctx.addVariables([
			 * { name: 'variable2', value: 'new value' }
			 * ])
			 * ```
			 */
			addVariables: (variables: {name: string, value: string}[]) => this.addVariables(variables, ctx),
			/**
			 * Removes multiple variable's (from this new ctx)
			 * @param variables - variables to remove
			 * @returns 
			 * @example
			 * ```ts
			 * ctx.removeVariables([
			 *  'variable2'
			 * ])
			 * ```
			 */
			removeVariables: (variables: string[]) => this.removeVariables(variables, ctx),
			/**
			 * gets a variable from this context
			 * @param name 
			 * @returns 
			 * @example
			 * ```ts
			 * ctx.getVar('variable3')
			 * ```
			 */
			getVar: (name: string): undefined | string | Function => ctx[name],
			/**
			 * Parse a String with this context
			 * @param str - string to parse
			 * @param staticProps - Since static props will be same for each expression, you can store the staticProp object and provide it with the parse function to stop parser wasting time to generate one
			 * @returns 
			 * @example
			 * ```ts
			 * ctx.parse('script').then(console.log)
			 * ```
			 */
			parse: (str: string, staticProps: any = null) => Parser.parse(str, ctx, staticProps, this),
			/**
			 * The actual new ctx
			 */
			ctx: ctx
		}
	}
	/**
	 * Parses given string and returns the formatted string. better to use {@link getNewCtx}
	 * @param str - string to parse
	 * @param ctx - the context object for this script
	 * @param staticProps - Since static props will be same for each expression, you can store the staticProp object and provide it with the parse function to stop parser wasting time to generate one
	 * @param parser - the parser this function belongs to
	 */
	public static async parse(str: string, ctx: { [key: string]: string }, staticProps: any = null,  thisContext: Parser) {
		if(typeof str !== 'string') throw new ValidationError('parse()', 'str must be a string');
		let data = staticProps;
		if(!staticProps) {
			// user didn't provide any staticProps, get one ourselves
			data = getStaticProps(str, thisContext);
		}
		const original = str; 
		// no need to run the data through a InterPreter if there is no templates, less time to return the result
		if(!data?.templates.length) return str;
		// start a new InterPreter and run it 
		return await (new InterPreter(data, ctx, original, thisContext)).run()
	}
    /**
	 * register a new extension
	 * @param extension - the extension to add
	 * @param options - options for the extension
	 * @returns 
	 */
	register(extension: (options: any, extensionManager: ExtensionManager) => { [key:string]: string | Function }, options: { [key: string]: string }) {
		 this.extensionManager.register(extension, options);
        // so users can keep chaining .register calls
		 return this;
	}
}

export default Parser