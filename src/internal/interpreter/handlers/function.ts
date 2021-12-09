/**
 * Handler for functions, parser arguments and calls functions
 */

import { exp_types } from "../../constants"
import Runner from "../interpreter"
import { makeString } from "./string";
import util from 'util';
import { default as getHandler } from './index';


export const parseArguments = async (ctx: any, args: any[], runner: Runner) => {
	return await Promise.all(args.map(async (arg: any) => {
		const type = arg.type;
		let result = null;
		switch(type) {
			case exp_types.string:
				// if type == string then just assign the value without any changes (use makeString as normal)
				result = makeString(ctx, arg.name, runner)
			break;
			case exp_types.variables:
				// get the value of the variable
				const handler = getHandler(exp_types.variables)
				result = await handler(ctx, arg, runner)
			break;
		}

		return result;
	}))
}

export const handle_F_Args = async (ctx: any, FuncData: any, runner: Runner) => {
	let func = FuncData.name;
	let args = FuncData.params;
	let result = ''
	if(!ctx[func] || typeof ctx[func] !== 'function') return runner.throwError(`Function ${func} is Undefined`)
	args = await parseArguments(ctx, args, runner)
	func = ctx[func];
	try {
		result = util.types.isAsyncFunction(func) ? await func(ctx, args) : func(ctx, args)
	}
	catch(err) {
		// custom function to throw the error if user enabled it
		runner.throwError(`Error while calling function ${FuncData.name}(<params>) Error: ${err}`)
	}

	return result;
}

export const handle_N_Args = async (ctx: any, FuncData: any, runner: Runner) => {
	let func = FuncData.name;
	if(!ctx[func] || typeof ctx[func] !== 'function') return runner.throwError(`Function ${func} is Undefined`)
	let result = '';
	try {
		// result = to calling the function, await it if its a async func
		result = util.types.isAsyncFunction(ctx[func]) ? await ctx[func](ctx, []) : ctx[func](ctx, [])
	}
	catch(err) {
		// custom function to throw the error if user enabled it
		runner.throwError(`Error while calling function ${FuncData.name}(<params>) Error: ${err}`)
	}
	return result;
}

export const handler_FUNC = async (ctx: any, funcData: any, runner: Runner) => {
	let result = ''
	// there are 2 types of functions, with params or without params
	switch(funcData.type) {
		case exp_types.function_withParams:
			result = await handle_F_Args(ctx, funcData, runner)
		break;
		case exp_types.function_withoutParams:
			result = await handle_N_Args(ctx, funcData, runner);
		break;
	}
	return result;
}