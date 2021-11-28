/**
 * Only returns the TYPE for a expr
 * Belongs to the parser
 */

import { exp_types } from "../constants";
import { cleanString } from "../utils";
// test functions for various expr types
import { test as testFunction, hasParams, functionParamsRegex } from "./function";
import { test as testString } from "./string";
import { test as testDeclaration } from "./variable";
import { match, test as testCondition } from "./conditions";


export const getTypes = (expression: string) => {
	const type = testString(expression) ? testCondition(expression) ? exp_types.condition : exp_types.string : testDeclaration(expression) ? exp_types.declaration : testFunction(expression) ? hasParams(expression) ? exp_types.function_withParams : exp_types.function_withoutParams : exp_types.unknown
	return type
}

// parse a exp and return data about it, this is not aware of any context, just parses them by their type
export const getData = (exp: string, type: string) => {
	let data = { name: 'unknown', type: type }
	switch(type) {
		case exp_types.function_withParams:
			Object.defineProperties(data, {
				name: { value: exp.split('(')[0], enumerable: true },
				params: { value: cleanString(exp.substring(exp.indexOf('(') + 1, exp.lastIndexOf(')'))).split(/,\s*/).map((s: string) => getData(s, getTypes(s))), enumerable: true },
				type: { value: type, writable: false, enumerable: true },
			})
		break;
		case exp_types.function_withoutParams:
			Object.defineProperties(data, {
				name: { value: exp.split('(')[0], enumerable: true },
				params: { value: [], writable: false, enumerable: true },
				type: { value: type, writable: false, enumerable: true },
			});
		break;
		case exp_types.string: 
		Object.defineProperties(data, {
			name: { value: exp, enumerable: true },
			type: { value: type, writable: false, enumerable: true },
		});
		break;
		case exp_types.declaration: 
		const s = exp.split('=')
		Object.defineProperties(data, {
			name: { value: cleanString(s[0]), enumerable: true },
			values: { value: s[1].split(/\./g).map(s => cleanString(s)).map(s => getData(s, getTypes(s))), enumerable: true },
			type: { value: type, writable: false, enumerable: true },
		});
		break;
		case exp_types.unknown: 
		Object.defineProperties(data, {
			variableAccess: { value: exp.split(/\./g).map(s => cleanString(s)), writable: false, enumerable: true },
			type: { value: exp_types.variables, writable: false, enumerable: true },
			name: { value: exp, enumerable: true },
		});
		break
		case exp_types.condition:
			const conditions = match(exp)
			// if there is no "if():" its not a valid condition block
			if(!conditions[0]) break;
			Object.defineProperties(data, {
				type: { value: type, enumerable: true, writable: false },
				if: { value: conditions[0], enumerable: true, writable: false },
				else_if: { value: conditions[1], enumerable: true, writable: false },
				else: { value: conditions[2], enumerable: true, writable: false }
			});
		break;
	/*	case exp_types.variables:
			Object.defineProperties(data, {
				type: { value: exp_types.variables, writable: false, enumerable: true },
				name: { value: exp, enumerable: true },
			})*/
		break;
	}
	return data
}