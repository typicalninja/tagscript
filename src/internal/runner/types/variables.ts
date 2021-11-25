/**
 * Runner : Handler for variables
 */

import Runner from "..";
import util from 'util';
import { exp_types } from "../../constants";
import { makeString } from "./string";

export const accessVariables = (ctx: { [key: string]: string | undefined } | undefined | string, runner: Runner, variables: string[]) => {
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

export const handler_DEC = (ctx: { [key: string]: string | undefined } | undefined | string, varData: any, runner: Runner) => {
	let c = ctx;
	let construct = '';
	let i = 0;
	for(const vals of varData.values) {
		const type = vals.type;
		construct += i == 0 ? varData.name : '.' + varData.name
		i++
		if(c == undefined || c == null) throw new Error(`Cannot set values to ${c == undefined ? 'undefined' : 'null'} (Settings ${varData.name} of ${construct})`)

		switch(type) {
			case exp_types.string:
				// @ts-ignore
				c[varData.name] = makeString(ctx, vals.name)
			break;
			case exp_types.variables:
				const variable = accessVariables(ctx, runner, vals.variableAccess);
						// @ts-ignore
				c[vals.name] = variable;
			break;
		}
		if(type == exp_types.string) return '';
	}
	return '';
}

export const handler_VAR = async (ctx: any, varData: any, runner: Runner) => {
	const variable = accessVariables(ctx, runner, varData.variableAccess);

	return util.inspect(variable);
}