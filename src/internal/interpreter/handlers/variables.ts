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

export const handler_DEC = async (ctx: { [key: string]: string | undefined } | undefined | string, varData: any, runner: Interpreter) => {
	let c = ctx;
	let construct = '';
	let i = 0;
	for(const vals of varData.values) {
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
}

export const handler_VAR = async (ctx: any, varData: any, runner: Interpreter) => {
	const variable = accessVariables(ctx, runner, varData.variableAccess);

	return util.inspect(variable);
}