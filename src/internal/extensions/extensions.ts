import Parser from "../../parser";


class ExtensionManager {
	extensions: Map<string, any>;
	interpreterExtensions: Map<string, any>;
	staticGeneratorExtensions: any[];
	parser: Parser;
	constructor(parser: Parser) {
		this.extensions = new Map();
		this.interpreterExtensions = new Map();
		this.staticGeneratorExtensions = [];
		this.parser = parser
	}
	// extension must be a function, throw error if not
	// it gets called with the options as the first parameter
	// result of calling extension returns a extension object
	// extension object contains few 
	register(extension: (options: any, extensionManager: ExtensionManager) => { [key:string]: string | Function }, options: { [key: string]: string }) {
		if (typeof extension !== 'function') {
			throw new Error('Extension must be a function');
		}
		// call the extension function
		const extensionObject = extension(options, this);
		if (!extensionObject.name) throw new Error('Extension must have a name');

		// init the extension
		// all validations are done now
		if (extensionObject.onLoad && typeof extensionObject.onLoad == 'function') {
			try {
				extensionObject.onLoad(this, options);	
			}
			catch(err) {
				throw new Error(`Extension: Error while Calling onLoad for extension ${extensionObject.name} : ${err}`);
			}
		}
		// set the extension in
		this.extensions.set(extensionObject.name as string, extensionObject);

		this.registerInterpreterProps(extensionObject);
		this.registerStaticProps(extensionObject);
	}
	registerInterpreterProps(extensionObject: { [key:string]: any }) {
		if(extensionObject.interpreterExtensions) {
			const exts = extensionObject.interpreterExtensions as Array<any> || [];


			exts.forEach((handler: { [key:string]: string | Function }) => {
				if(!handler.type || typeof handler.type !== 'string') throw new Error('Handler must have a type and it should be a string');
				if(!handler.handler) throw new Error('Handler must have a handler');
				if(typeof handler.handler !== 'function') throw new Error('Handler must have a function as a handler');

				this.interpreterExtensions.set(handler.type as string, handler.handler);
			});
		}
	}
	registerStaticProps(extensionObject: { [key:string]: any }) {
		if(extensionObject.staticGeneratorExtensions) {
			const exts = extensionObject.staticGeneratorExtensions as Array<any> || [];

			exts.forEach((ext: { [key:string]: string | Function }) => {
				if(!ext.type || typeof ext.type !== 'string') throw new Error('Extension must have a type and it should be a string');
				if(!ext.test || typeof ext.test !== 'function') throw new Error('Extension must have a test function');
				if(!ext.getData || typeof ext.getData !== 'function') throw new Error('Extension must have a getData function');
					this.staticGeneratorExtensions.push(ext);
				});
			}
		}
	getInterpreterExtension(type: string): Function {
		if(typeof type !== 'string') throw new Error('Type must be a string');
		return this.interpreterExtensions.get(type) || (() => null);
	}
	// static generator extensions contains a Array of objects provided by extensions containing following properties	
	// test: function - runs test function to see if given expression matches at least once
	// type: string - if test function returns true what is the type that should be returned
	// returns the type if test function returns true else returns null
	// returns immediately the type if the test function returns true
	testStaticExpression(expression: string) {
		const extensions = this.staticGeneratorExtensions;
		for(let i = 0; i < extensions.length; i++) {
			const ext = extensions[i];
			if(ext.test(expression)) {
				return ext.type;
			}
		}
		return false;
	}

	getStaticExpression(type: string) {
		if(typeof type !== 'string') throw new Error('Type must be a string');
		return this.staticGeneratorExtensions.find((ext: { [key:string]: string | Function }) => ext.type === type);
	}
}

export default ExtensionManager