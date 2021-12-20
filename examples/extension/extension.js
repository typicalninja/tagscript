const { createLoadExtensionData } = require('../../dist/index');

/* 
Example: This is a example of a tagscript extension.
Description: The tagscript extension will allow a new custom "string definition" to be created.
	Ex: {;test;} will be counted as a string with hte below setup
*/

// since the built in utility makeString function does not support a custom start and end, we must use our own
// this is the same makeString function as the built in one, but with the start and end replaced
const stringTemplates = /\$\((.*?)\)/gi
// this does not support "." syntax, but is not needed for this example either
function makeString(ctx, string, extensionOptions) {
	if(string == undefined || string == null || string == 'undefined' || string == 'null') return null;
	if(typeof string !== 'string') string = String(string)
	if(string.startsWith(extensionOptions.start) && string.endsWith(extensionOptions.end)) { string = string.slice(1, -1); }
	const vars = string.match(stringTemplates);
	if(!vars) return string;
	for(let variable of vars) {
		const key = variable.slice(2, -1)
		let value = ''
		if(ctx[key]) { value = ctx[key]; if(typeof value !== 'string') value = String(value) }
			const regex = new RegExp(`\\$\\(${key}\\)`, 'g')
			string = string.replace(regex, value)
	}
	return string;
}

class Extension {
	constructor(options) {
		this.options = options;
		// add a name to this extension
		this.name = 'myExample-Extension';
		this.start = this.options.start || ';'
		this.end = this.options.end || ';'
		// normally this would not be placed here, but for the example it is
		// TYPE_STRING_EXTENDED will be the type used here as its not the best to make in a built in type (TYPE_STRING)
		this.type = 'TYPE_STRING_EXTENDED';
		// create a regex to detect things between the start and end (;, ;)
		this.regex = new RegExp(`^${this.start}[^${this.start}]*${this.end}`, 'im')
	}
	// called after the extension is loaded
	onLoad() {
		return console.log(`${this.name} Loaded`)
		// can use to alert a user if the extension loaded
	}
	testStaticExtension(exp) {
		return this.regex.test(exp)
	}
	handleInterpreter(ctx, strData) {
		return makeString(ctx, strData.name, { end: this.end, start: this.start })
	}
	getStaticExtension(exp) {
		// this extension does not have much so this is enough
		return {
			name: exp,
			type: this.type
		}
	}
	getStaticExtensionData() {
		return [
			{
				type: this.type,
				test: this.testStaticExtension.bind(this),
				getData: this.getStaticExtension.bind(this)
			}
		]
	}

	getInterpreterExtensionData() {
		return [
			{
				type: this.type,
				handler: this.handleInterpreter.bind(this)
			}
		]
	}

}

// a function to be exported, since tagscript needs a function for the "register(<function>, <options>)"
// will create a new Extension instance when called
// after the loadExtension is called "Internally" its expected to return a {} (object) with the required values
function loadExtension(options = {}) {
	const ext = new Extension(options);
	// utility provided by tagscript to create a all the extension data required
	// it looks for the following properties (with types) in the provided item (ext instance of the class here):
	// 		name: the name of the extension (string, required)
	//  	onLoad: a function to be called when the extension is loaded (function, optional)
	//      getStaticExtensionData: a Function to get static extensions, needs to return an array of objects which should have following properties (function, optional):
	// 			type: the type that the parsed expression belongs to if it does pass (string, required)
	// 			test: a function to test if the expression is valid (function, required)
	// 			getData: a function to get the data for the expression (function, required)
	// 		getInterpreterExtensionData: a function to get interpreter extensions, needs to return an array of objects which should have following properties (function, optional):
	// 			type: The type of expression this Interpreter Extension should handle (string, required)
	// 			handler: a function to handle the expression, ran if the type matches a expression (function, required)
	return createLoadExtensionData(ext);
}


module.exports = loadExtension;