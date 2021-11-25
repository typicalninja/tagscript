> this is the beta branch

# tagscript/beta

> Tagscript is mainly made for below use case.

* Discord bots Custom command / tags system (allow users to run a simple understandable scripts)

* Inspired by [JonSnowbd/TagScripScript](https://github.com/JonSnowbd/TagScript)
# Install

```
npm i @typicalninja21/tagscript
```

# Usage

### Basic

```js
const Parser = require('@typicalninja21/tagscript');

const parser = new Parser().getNewCtx();

const script = `
{rNumber = range(1, 500)}
{rText = choose(I choose, the chosen number is, it is)}

{rText} {rNumber}
`

// returns a Promise<string>, make sure to either use await or .then()
parser.parse(script).then(console.log)
```


### Using a custom functions/variables (Using custom context)

```js
const Parser = require('@typicalninja21/tagscript');

// global ctx
const parser = new Parser({
	ctx: {
	functions: {
		someFunction: (ctx, args) => {
		// do some stuff
		return 'something'
			}
		},
	variables: {
		authType: 'user'
	 }
	}
});


// context specific variables / functions
const ctx = parser.getNewCtx({
	functions: {
		isContext: () => true
	},
	variables: {
		context: 'user'
	}
});

// you can also add them using the ctx.addVariable or ctx.addFunction methods
ctx.addVariable('new', 'variable');
ctx.addFunction('Error', () => {
	// its better to return a error instead of throwing an error, since Error throws will be caught by the parser and converted to a => empty string
	return 'Error';
});

// simple script to demo this
const script = `
Auth Type is {authType}
context is {context}
isContext {isContext()}
someFunction {someFunction()}
new {new}
Error {Error()}
`

ctx.parse(script).then(console.log)
```

### If/ else if/ else statements

> **Remember** :
* only **1** else if statement
* else / else if should follow a if statement
* if() should be followed by a ":" and end with a ":"
* else if / else should follow the same rules, use the ending ":" as the starting ":" for else / else if's
* less if / else if / else == faster parsing (should limit to 1 - 2 if/else if/else statements per script)


```js
// define parser and stuff here

const script = `
{l = range(1, 10)}
{rand = NONE}
{if(l < 5):
rand = random number is under 5
:else if(l > 5)):
rand = random number is over 5
:else:
rand = random number is 5
:}
{rand}
`


parser.parse(script).then(console.log)
```


### Defining a variable

> already shown above but, just for reference
* variables can be defined with the syntax {variableName = value}
* there no explicit way to define a "string"
* if the value after the = is not a function / variable it will be taken as a string

```js
// define parser and stuff here

const parser = new Parser().getNewCtx();

const script = `
{l = something here}
`
```


### Defining a function

> Basically, you **cant** inside the script, you can use the above mentioned "using a custom functions/variables" section to learn on how to define a variable / function globally or ctx based

### Errors

> Its **best** to __return__ a error **Instead** of throwing an error, since Error throws will be caught by the parser and converted to a => empty string

Note: if you want errors to not appear in the final parsed string, throw a error or return a empty error your self, and vice versa if you want the error to appear, return the error


# Support

> This package was made for my own discord bot's ([axix](https://axixbot.cf) v2) custom commands / tags system

* If you need support for this package, please join the [support server](https://discord.com/invite/HVnGtzMaW4)