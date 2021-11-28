
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
# User guide

> A Guide to users who want to write scripts (refer your users if you want to here)

> **Note:** All of the below code is inside {} unless specified

## Table of contents
1. [Functions](#functions) :
   1. [Functions without params](#functions-without-params)
   2. [Functions with params](#functions-with-params)
2. [Variables](#variables)
	1. [Defining a variable](#defining-a-variable)
	2. ["." Syntax](#quotquot-syntax)
### Functions

> You can call functions as demonstrated below

* The Important part to call the Function is "()"
* make sure there no spaces between "function name" and "()"
* if throwError is enabled and there is no function name that, a error will be thrown
* by default there are no functions defined
* And you (as the user writing script) cant define functions

#### Functions without params

> functions without params are called normally like below

```
	function() 
```

* A Function without anything in between "()" is a Function without params
* Passing no params to a function that expects param's might throw a Error (depends on the function)
#### Functions with params

> Functions with params are bit different but not complex

```
	function(<param>, <param>)
```

* Define functions params inside "()"
* separate each param by a ","
* strings should be between acceptable string start and ends characters (", ')
* functions in param's is **Supported** but is not guaranteed to be stable and fast

### Variables

> see the below sub topics on different ways of using them

* if throwError is enabled and variable is not in the specified context, error will be thrown
* "." syntax is supported (ex: variable1.variable2 < Variable 2 must be a Sub Property of variable1) 

#### Defining a variable

> Format to defining a variable is `variable = value`

```
variable = "string value"
# or
variable = functionValue();
# or
variable2 = variable
```

* Value can be a `string / function / another variable`
* when defining you may override a previously defined variable
* make sure to define a variable before using it
* If variable is undefined and throwError is enabled it will throw a Error

#### "." syntax

> "." syntax is simple, see the below example

```
variable1.variable2
```

* Here, variable 1 has a sub property called variable2.
* You can keep chaining these (only if the sub Properties exists)
* if throwError is enabled and `variable1` is undefined a Error will be thrown
# Support

> This package was made for my own discord bot's ([axix](https://axixbot.cf) v2) custom commands / tags system

* If you need support for this package, please join the [support server](https://discord.com/invite/HVnGtzMaW4)