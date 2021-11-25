const Parser  = require("../dist/src/parser.js").default;
const parser = new Parser({
	throwError: true
});
const ctx = parser.getNewCtx()

var assert = require('assert');


describe('ctx customizing', () => {
	it('Should add a variable', () => {
		ctx.addVariable('test', 'test')
		const v = ctx.getVar('test');
		assert.equal(typeof v, 'string');
		assert.equal(v, 'test')
	});

	it('Should add a Function', () => {
		ctx.addVariable('try', () => 'test')
		const f = ctx.getVar('try')
		assert.equal(typeof f, 'function')
		assert.equal(f(), 'test')
	});

	// remove the previous items
	it('Should remove a Variable', () => {
		ctx.removeVariable('test');
		const v = ctx.getVar('test');
		assert.equal(v, undefined)
	});

	it('Should remove a Function', () => {
		ctx.removeVariable('try');
		const f = ctx.getVar('try');
		assert.equal(f, undefined)
	});
})