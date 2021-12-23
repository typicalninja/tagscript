/**
 * Example: Uses a Database to store the static property and get them when needed to be rendered
 * for example we will be using a json database for demo purposes
 */
// for demo purposes we will use a map instead of a actual db
 const db = new Map()


const { Parser, getStaticProps } = require('../../dist/index');
const parser = new Parser({ throwError: true });

const scriptName = 'script_database_example'

// just some random stuff
const script = `
this is a test Script
{hey = "hiii"}
>> {hey}
whats up
bla bla
{whatis = "bla"}
{"what is $(whatis)?"}
`

function runScript() {
	const ctx = parser.getNewCtx();
	let staticProps = null;
	if(db.has(scriptName)) {
		staticProps = db.get(scriptName);
	}
	return ctx.parse(script, staticProps)
}

function initStaticProps() {
	if(db.has(scriptName)) return db.get(scriptName);
	const staticProps = getStaticProps(script)
	db.set(scriptName, staticProps)
	return staticProps;
}
const start = Date.now()
runScript().then(() => {
	console.log(`First Script ran (without a static object), took ${Date.now() - start}ms`);
	initStaticProps()
	const start2 = Date.now()
	runScript().then(() => {
		console.log(`Second Script ran, took ${Date.now() - start2}ms`);
	});
});


/* 
Results Expected (from tests ran)
logs:
First Script ran (without a static object), took 7ms
Second Script ran, took 1ms

| 
First Script ran (without a static object), took 11ms
Second Script ran, took 0ms   

|
First Script ran (without a static object), took (high)ms
Second Script ran, took (low)ms   
*/