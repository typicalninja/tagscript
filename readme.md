
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
{func = choose('today is great'; 'today is bad')}
{"is today great? $(func)"}
{randomOfRandom = choose(func; 'idk')}
{"Random of Random is $(randomOfRandom)"}
`

// use the parse function
ctx.parse(script).then(console.log).catch(console.log)
```

# Using from the web

We offer a web bundle that is bundled with [webpack](https://webpack.js.org/) and is available at the following cdns

* If possible download this and host on your own website (recommended)
* If not just directly use one of the following cdns (not recommended):

> [jsdelivr](https://cdn.jsdelivr.net/gh/typicalninja493/tagscript@beta/web/bundle.js) (recommended)


> [statically](https://cdn.statically.io/gh/typicalninja493/tagscript@beta/web/bundle.js)

# Live Demo / Tagscript Editor

You can find a Live Demo / Tagscript Editor [here](https://typicalninja493.github.io/tagscript/editor.html)

> The editor utilizes the web [bundle](#using-from-the-web) 

# Extensions

> Yess, this library allows you to extend it's functionality without directly interacting with the source code

> [here](https://typicalninja493.github.io/tagscript/extension.html) is A simple Guide on this Subject

> [Click for guide](https://typicalninja493.github.io/tagscript/extension.html)

# Optimizing / Providing Pre gen static Data

> You can click [here](https://typicalninja493.github.io/tagscript/static.html) for guide on this topic
> or [Click here for guide](https://typicalninja493.github.io/tagscript/static.html)
# User Guide

> A Complete guides for users wanting to write their own scripts can be found [here](https://typicalninja493.github.io/tagscript/guide.html)

[Or Click here](https://typicalninja493.github.io/tagscript/guide.html)

# Support

> This package was made for my own discord bot's ([axix](https://axixbot.cf) v2) custom commands / tags system

* If you need support for this package, please join the [support server](https://discord.com/invite/HVnGtzMaW4)