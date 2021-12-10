class ExtensionManager {
	extensions: Map<string, any>;
	constructor() {
		this.extensions = new Map();
	}
	// extension must be a function, throw error if not
	// it gets called with the options as the first parameter
	// result of calling extension returns a extension object
	// extension object contains few 
	register(extension: string, options: { [key: string]: string }) {
		
	}
}