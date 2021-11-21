import Runner from "..";
import util from 'util';
import { exp_types } from "../../constants";

export const accessVariables = (ctx: any, runner: Runner, variables: string[]) => {
	let c = ctx.variables;
	let construct = '';
	let i = 0;
	for(const variable of variables) {
		construct += i == 0 ? variable : '.' + variable
		i++
		if(c == undefined || c == null) runner.throwError(`Cannot read properties of ${c == undefined ? 'undefined' : 'null'} (Reading var ${variable} of ${construct})`)
		else if(c[variable]) c = c[variable];
		else {
			c = undefined;
		}
	}

	return c;
}

export const handler_DEC = (ctx: any, varData: any, runner: Runner) => {
	let c = ctx.variables;
	for(const vals of varData.values) {
		const type = vals.type;
		switch(type) {
			case exp_types.string:
				c[varData.name] = vals.name;
			break;
			case exp_types.variables:
				const variable = accessVariables(ctx, runner, vals.variableAccess);
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