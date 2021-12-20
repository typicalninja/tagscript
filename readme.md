
# beta
# tagscript

> Easy to use Templating system. Let your user's write scripts themselves

# Install

```diff
	npm i @typicalninja21/tagscript
```

# Docs

> Docs are available at [here](https://typicalninja493.github.io/tagscript/)

# Usage

> All of these Examples are in **Typescript** If you want to use **Javascript** you will have to convert the example's to javascript

* Base Code: This is the base code needed for below examples

```ts
import { Parser } from '@typicalninja21/tagscript'

const parser = new Parser();

// get a new Context
const ctx = parser.getNewCtx();
```

### All in one
> Below is a full complete script to showcase the features of this package, you can see below for more specific examples

```ts
// ctx is defined in above base snippet
// choose() is a default function, you will have to apply it
// process and its sub property is a default function, you will have to apply it
const script = `
{var = 'string'}
{"var is defined as $(var)"}
{func = choose('today is great', 'today is bad')}
{"is today great? $(func)"}
{randomOfRandom = choose(func, 'idk')}
{"Random of Random is $(randomOfRandom)"}
{"Process Version is $(process.version) (we support "." syntax) }
`

// use the parse function
ctx.parse(script).then(console.log).catch(console.log)
```

# Using from the web

We offer a web bundle that is bundled with [webpack](https://webpack.js.org/) and is available at the following cdns

* If possible download this and host on your own website (recommended)
* If not just use one of the following cdns (not recommended):

[jsdelivr](https://cdn.jsdelivr.net/gh/typicalninja493/tagscript@beta/web/bundle.js) (recommended)
[statically](https://cdn.statically.io/gh/typicalninja493/tagscript@beta/web/bundle.js)

# Live Demo / Tagscript Editor

You can find a Live Demo / Tagscript Editor [here](https://typicalninja493.github.io/tagscript/editor.html)

> The editor utilizes the web [bundle](#using-from-the-web) 
# Providing Static props

> Static props is a object containing data about a expression (script / string you provide). it contains data about expression type and whats contained.Static props are unique between different expressions, but same with every expression

**example:**

```ts
const script1 = `
{"this is a example"}
`

const script2 = `
{exampleFUNC()}
`
```

> Here `script1` 's static prop Object will be different from `script2`'s static Prop Object. but when u generate a new **Static object** for script1 it will still be equal to the earlier generated **Static Prop** of `script1`, same will be said for `script2`


### Using this for our advantage

> As said in the main title, we can provide a static object our selves to our parser. if we do not provide one the parser will take time to generate one **itself** and run it.we can save the time it takes to generate a **Static Prop object** by storing a previously generated **Static Prop Object** to our storage (Database) with the rest our data 

**Example (Following is not a complete code, just a example)**

```ts
// first import all the things we need
import { Parser, getStaticProps } from '@typicalninja21/tagscript'

const db = /* What ever your db is here */

const parser = new Parser({
	throwError: true
});

function saveScript(scriptName, script) {
	return db.save(scriptName, {
		script,
		runnable: getStaticProps(script),
		/*Some other data here...*/
	})
}

function runScript() {
const scriptData = db.get('checkIfTrue');

// we will assume db.get (scriptData) will return the value we stores using saveScript()
	const ctx = parser.getNewCtx();

  /*Add Variables and stuff here (do your usual stuff here) */
  // finally parse
  return ctx.parse(scriptData.script, scriptData.runnable)
}


// first save the script
saveScript('checkIfTrue', `{checkTrue(true)}`)
runScript('checkIfTrue').then(console.log)
```

# User Guide

> A Complete guides for users wanting to write their own scripts can be found [here](https://typicalninja493.github.io/tagscript/guide.html)

[Or Click here](https://typicalninja493.github.io/tagscript/guide.html))
# Support

> This package was made for my own discord bot's ([axix](https://axixbot.cf) v2) custom commands / tags system

* If you need support for this package, please join the [support server](https://discord.com/invite/HVnGtzMaW4)