import util from 'util';
import Runner from '../runner';
import { accessVariables } from './variables';

// variable in string are in from of $(var)
export const stringTemplates = /\$\((.*?)\)/g

// formats a string, (strings as in whats treated as a string in tagscript)
export const makeString = (ctx: any, string: string, runner: Runner) => {
	// if string == to anything below return null
	if(string == undefined || string == null || string == 'undefined' || string == 'null') return null;
	if(typeof string !== 'string') string = String(string)
	// slice off the start and end of the string which will be [', "]
	if(string.startsWith("'") && string.endsWith("'") || string.startsWith('"') && string.endsWith('"')) {
		string = string.slice(1, -1);
	}
	// add's support for strings of form "...something  $key1 $key2"
	const vars = string.match(stringTemplates);
	// if no vars to replace return the string as it is
	if(!vars) return string;
	for(let variable of vars) {
		// split off the [$(, )]
		const key = variable.slice(2, -1)
		let value = ''
		// if there is a value in ctx with key ? value = ctx[key]
		if(ctx[key]) {
			value = ctx[key];
			// convert the value to a string if its not
			if(typeof value !== 'string') value = util.inspect(value)
		}
		else {
			// supports "." (ex: key.value) in strings
			 value = accessVariables(ctx, runner, key.split('.') || [key]) as string
		}
			// use a regex to replace globally
			const regex = new RegExp(`\\$\\(${key}\\)`, 'g')
			// replace all of the vals in the string
			string = string.replace(regex, value)
			// console.log('string:', string, value)
	}

	// return the replaced string
	return string;
}

export const handler_STR = (ctx: any, strData: any, runner: Runner) => {
	const str = strData.name;
	return makeString(ctx, str, runner)
}