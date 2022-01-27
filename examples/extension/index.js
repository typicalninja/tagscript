const { Parser } = require('../../dist/index');
const extension = require('./extension.js');

const parser = new Parser({ throwError: true });

// add our extension
parser.register(extension, { start: ';', end: ';' });

const testScript = `
this is a test Script
{detected = "should support as string"}
Result >> {;is a string, $(detected);}
`

const ctx = parser.getNewCtx();


ctx.parse(testScript).then(console.log).catch(console.log)

/* 
Expected Result:
	Prints the following to the console

"
this is a test Script

Result >> is a string, should support ; as strings
"

Additionally the following should be printed to the console due to extension being loaded:
"
myExample-Extension Loaded
"
*/