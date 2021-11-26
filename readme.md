# tagscript

> Easy to use Templating system. Made for giving

# Install

```
	npm i @typicalninja21/tagscript
```

# Docs

> Docs are available at [here]()

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
const script = `
{var = 'string'}
{"var is defined as $(var)"}
{func = choose('today is great', 'today is bad')}
{"is today great? $(func)"}
{randomOfRandom = choose(func, 'idk')}
{"Random of Random is $(randomOfRandom)"}
`
```


# Support

> This package was made for my own discord bot's ([axix](https://axixbot.cf) v2) custom commands / tags system

* If you need support for this package, please join the [support server](https://discord.com/invite/HVnGtzMaW4)