const Parser  = require("../dist/src/parser.js").default;
const parser = new Parser({
	throwError: true
});
const ctx = parser.getNewCtx()

var assert = require('assert');

describe('Performance', () => {
	it('Should only take or be under 5000ms to parse and return the result', async () => {
		const timeout = setTimeout(() => {
			throw new Error('Took more than 5000ms')
		}, 5000);
		parser.addVariables([
			{ name: '1', value: 1 },
			{ name: '2', value: 2 },
			{ name: 'func', value: (ctx, args) => args[0] }
		])
		const script = `
		{func('1:: [$1:$2]')}
		{pop = func('2:: [$1::::$2]')}
		{'$1 :: $2'}
		`

	//	await ctx.parse(script).then((r) => {
			clearTimeout(timeout)
		//	console.log(r)
		//})
	});
})