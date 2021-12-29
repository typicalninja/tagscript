/**
 * interpreter : Handler for variables
 */

import Interpreter from "../interpreter";
import util from 'util';
import { exp_types } from "../../constants";
import { makeString } from "./string";
import { default as getHandler } from './index';
import { updateVM } from "../vm";

export const accessVariables = (ctx: { [key: string]: string | undefined } | undefined | string, runner: Interpreter, variables: string[]) => {
	let c = ctx;
	let construct = '';
	let i = 0;
	for(const variable of variables) {
		construct += i == 0 ? variable : '.' + variable
		i++
		if(c == undefined || c == null) runner.throwError(`Cannot read properties of ${c == undefined ? 'undefined' : 'null'} (Reading var ${variable} of ${construct})`)
		//@ts-ignore
		else if(c[variable]) c = c[variable];
		else {
			c = undefined;
		}
	}

	return c;
}

// handles declaration of variables
// e.g. a = 1
// e.g. b = a + 1
// e.g. c = a + b
// e.g. d = 'some string"
// use accessVariables function to access the variables
// users cant set "." syntax variables (only access)
// e.g. d.e = 'another string' - should not work
// how ever users can set a variable to another variable using "." syntax
// e.g. d = date.now
// parts of sub variables can be functions, eg. Date.now().string()
// varData contains following properties
// relevant properties:
// values: array (split variable def by "." to support "." syntax, e.g. l = a.b.c => [{name: 'a', type: 'TYPE_VARIABLE', variableAccess: ['a'] } ....others])
export const handler_DEC = async (ctx: { [key: string]: string | undefined } | undefined | string, varData: any, runner: Interpreter) => {
	let c = ctx;
	let construct = '';
	let i = 0;
	let variable;
	// if only one variable 
	// eg a = 1
	// eg b = "string"
	if(varData.values.length == 1) {
		variable = varData.values[0]
		// if its a number
		if(!isNaN(variable.name)) {
			Object.defineProperty(c, varData.name, {
				value: Number(variable.name),
				writable: true,
				enumerable: true,
			})
			updateVM(c)
			return ''
		}
		else if(variable.name === 'true' || variable.name === 'false') {
			const boolean = variable.name === 'true' ? true : false;
			Object.defineProperty(c, varData.name, {
				value: boolean,
				writable: true,
				enumerable: true,
			})
			updateVM(c)
			return ''
		}

		switch(variable.type) {
			case exp_types.string:
				Object.defineProperty(c, varData.name, {
					value: makeString(ctx, variable.name, runner),
					writable: true,
					enumerable: true,
				});	
			break;
			case exp_types.variables:
				Object.defineProperty(c, varData.name, {
					value: accessVariables(ctx, runner, variable.variableAccess),
					writable: true,
					enumerable: true,
				})
			break;
			case exp_types.function_withParams:
			case exp_types.function_withoutParams:
				const handler = getHandler(variable.type, runner)
				Object.defineProperty(c, varData.name, {
					value: await handler(ctx, variable, runner) || null,
					writable: true,
					enumerable: true,
				})
			break
		}
		updateVM(c)
		return ''
	
	} else {
		variable = accessVariables(ctx, runner, varData.values);
	}

	return ''
}

export const handler_VAR = async (ctx: any, varData: any, runner: Interpreter) => {
	const variable = accessVariables(ctx, runner, varData.variableAccess);

	return util.inspect(variable);
}

/*
old backup code
>>
	let c = ctx;
	let construct = '';
	let i = 0;
	for(const vals of varData.values) {
		console.log('vals:', vals, 'construct:', construct, 'varData:', varData)
		const type = vals.type;
		construct += i == 0 ? varData.name : '.' + varData.name
		i++
		if(c == undefined || c == null) return runner.throwError(`Cannot set values to ${c == undefined ? 'undefined' : 'null'} (Settings ${varData.name} of ${construct})`)

		switch(type) {
			case exp_types.string:
				// @ts-ignore
				c[varData.name] = makeString(ctx, vals.name)
				updateVM(c)
			break;
			case exp_types.variables:
				const variable = accessVariables(ctx, runner, vals.variableAccess);
					
				Object.defineProperty(c, varData.name, {
					value: variable,
					enumerable: true,
					configurable: true,
					writable: true,
				});
				updateVM(c)
			break;
			case exp_types.function_withParams:
			case exp_types.function_withoutParams:
				const handler = getHandler(type, runner)
				//console.log('ty:', type, vals, c, varData.name)

				Object.defineProperty(c, varData.name, {
					value: await handler(ctx, vals, runner) || null,
					enumerable: true,
					configurable: true,
					writable: true,
				});
				// update the vm
				updateVM(c)
			break;
		}
		if(type == exp_types.string) return '';
	}
	return '';

*/