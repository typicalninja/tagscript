// tests a custom lang extension

const { Parser, getStaticProps }  = require("../dist/index")
const parser = new Parser({
	throwError: true
});
const ctx = parser.getNewCtx()

var assert = require('assert');

const someExtension = (options) => {
	if(!options.someOption) throw new Error('someOption is not present');
	return {
		name: 'someExtension',
		// this is the function that will be called when the extension is first loaded
		onLoad: () => console.log('>> someExtension loaded'),
		// extension to interpreter
		interpreterExtensions: {
			handler: {
				type: 'TEST_EXP',
				handler: (h) => {
					console.log(h)
					return 'test'
				}
			}
		},
		// static generator extensions
		staticGeneratorExtensions: [
				{
					type: 'TEST_EXP',
					test: (exp) => {
						return true
				},
				getData: () => {
					return { name: 'test', fields: ['1', '2'] }
				}
				},
				{
					type: 'TEST_EXP',
					test: (exp) => {
						return true
					},
					getData: () => {
						return ({ name: 'test' })
					}
				}
			]
	}
}

const testScript = `
{should be detected immediately}
`


describe('Extension', () => {
	it('should fail due to someOption not being present', () => {
		assert.throws(() => {
			parser.register(someExtension, {})
		}, Error);
	});

	it('should register a extension', () => {
			parser.register(someExtension, { someOption: true })
	});

	it('should detect the given script globally', async () => {
	console.log(await ctx.parse(testScript))
	//	console.log(getStaticProps(testScript, parser).templates[0].data)
	})
});