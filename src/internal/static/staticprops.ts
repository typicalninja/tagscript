/**
 * Generate a Object with props for the runner to parser and interpret
 */
import { templateRegex } from "../constants"
import { getTypes, getData } from './types/index';
import { cleanString } from "../utils";

const applyDefaultData = (obj: Object, str: string) => {
	Object.defineProperties(obj, {
		raw: {
			value: cleanString(str),
			enumerable: true,
			writable: false,
			configurable: false
		},
		templates: {
			value: [],
			enumerable: true,
			writable: true,
			configurable: true,
		}
	});

	return obj;
}

/**
 * Generate a Object with props for the runner to parser and interpret
 * The object returned will be unique between different expression's but same every time for every expression
 */
export default (str: string): { raw: string; templates: { raw: string; exp: string; type: string; data: any }[] } => {
	// create a object
	const dat = Object.create(null);
	applyDefaultData(dat, str);
	const templates = str.match(templateRegex);
	if(!templates) return dat;
	for(const tag of templates) {
		const tag_DAT = {}
		// slice off the {}
		let exp = tag.slice(1, -1);
		exp = cleanString(exp);
		const type = getTypes(exp)

		Object.defineProperties(tag_DAT, {
			raw: {
				value: cleanString(tag),
				writable: false,
				enumerable: true
			},
			exp: {
				value: exp,
				writable: false,
				enumerable: true
			},
			type: {
				value: type,
				writable: false,
				enumerable: true
			},
			data: { 
				value: getData(exp, type),
				writable: false,
				enumerable: true
			}
		});

		dat.templates.push(tag_DAT)
	}
	return dat;
}