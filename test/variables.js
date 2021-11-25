/**
 * Test variable defining
 */

const Parser  = require("../dist/src/parser.js").default;
const parser = new Parser({
	throwError: true
});
const ctx = parser.getNewCtx()

var assert = require('assert');

// checks if a variable is defined correctly
describe('Variable Defining', function() {
	// should work
	it('Should define a String variable (string assignment)', function() {
		ctx.parse(`{d = "l"}`).then(() => {
			assert.equal(typeof ctx.getVar("d"), 'string');
			assert.equal(ctx.getVar("d"), "l");
		})
	});

	// should work
	it('Should be able to use "." syntax (string variables)', function() {
		ctx.addVariable('test', { what: 'Variable Defining' })
		ctx.parse(`{test.what}`).then((r) => {
			assert.equal(typeof r, 'string')
			assert.equal(r, "Variable Defining");
		});
	});

	// should error out
	it('should error due to p being not defined', async () => {
		// checks if async function parse errors using assert
		
			try {
				await ctx.parse(`{p.i}`)
				throw new Error('Did not throw')
			}
			catch {/** A Error was thrown : success */}
	});
});

