/**
 * Only returns the TYPE for a expr
 * Belongs to the parser
 */

import { exp_types } from "../../constants";
import { cleanString } from "../../utils";
// test functions for various expr types
import { test as testFunction, hasParams } from "./function";
import { test as testString } from "./string";
import { test as testDeclaration } from "./variable";
import { match, test as testCondition, parseChain } from "./conditions";
import Parser from "../../../parser";


export const getTypes = (expression: string, parser: Parser | null) => {
	const extensionTestFunc = parser?.extensionManager?.testStaticExpression?.bind(parser?.extensionManager) || (() => false);
	//const type = extensionTestFunc(expression) || (testString(expression) ? testCondition(expression) ? exp_types.condition : exp_types.string : testDeclaration(expression) ? exp_types.declaration : testFunction(expression) ? hasParams(expression) ? exp_types.function_withParams : exp_types.function_withoutParams : exp_types.unknown)
	const type = extensionTestFunc(expression) || (testString(expression) ? exp_types.string : false) || (testCondition(expression) ? exp_types.condition : false) || (testDeclaration(expression) ? exp_types.declaration : false) || (testFunction(expression) ? hasParams(expression) ? exp_types.function_withParams : exp_types.function_withoutParams : false) || exp_types.unknown
	return type;
}

// parse a exp and return data about it, this is not aware of any context, just parses them by their type
export const getData = (exp: string, type: string,  parser: Parser | null) => {
	let data = { name: exp, type: type }
	// type can be a custom type provided by a extension, handle them in default section
	switch(type) {
		case exp_types.function_withParams:
			Object.defineProperties(data, {
				name: { value: exp.split('(')[0], enumerable: true },
				params: { value: cleanString(exp.substring(exp.indexOf('(') + 1, exp.lastIndexOf(')'))).split(/,\s*/).map((s: string) => getData(s, getTypes(s, parser), parser)), enumerable: true },
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
			values: { value: s[1].split(/\./g).map(s => cleanString(s)).map(s => getData(s, getTypes(s, parser), parser)), enumerable: true },
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
			const conditions = parseChain(exp)
			Object.defineProperties(data, {
				type: { value: type, enumerable: true, writable: false },
				IF: { value: conditions.IF, enumerable: true, writable: false },
				ELSE_IFS: { value: conditions.ELSE_IFS, enumerable: true, writable: false },
				ELSE: { value: conditions.ELSE, enumerable: true, writable: false },
				//conditions: { value: conditions, enumerable: true, writable: false },
			});
		break;
	/*	case exp_types.variables:
			Object.defineProperties(data, {
				type: { value: exp_types.variables, writable: false, enumerable: true },
				name: { value: exp, enumerable: true },
			})*/
		default:
			const getStaticExpr = parser?.extensionManager?.getStaticExpression?.bind(parser?.extensionManager) || (() => ({ name: 'unknown', type: 'UNKNOWN' }));
			const staticExpr = getStaticExpr(type)
			let staticObject = staticExpr.getData(exp, parser) || { name: 'unknown', type: 'UNKNOWN' }
			if(!staticObject.type) {
				Object.assign(staticObject, { type: type })
			}
			if(!staticObject.name) {
				Object.assign(staticObject, { name: exp })
			}
			const allKeys = Object.keys(staticObject)
			allKeys.forEach(key => {
				Object.defineProperty(data, key, {
					value: staticObject[key],
					enumerable: true,
					writable: false
				})
			})
		break;
	}
	return data
}