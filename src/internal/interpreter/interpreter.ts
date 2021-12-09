/**
 * Runner, interpret and runs the object returned from parsing
 * ./handlers old the handlers for different types of expr
 */

import Parser from "../../parser";
import { stripIndents } from 'common-tags'
import { default as getHandler } from './handlers/index'
import { exp_types } from "../constants";
import { makeString } from "./handlers/string";

class Runner {
	ctx: {
		[key: string]: string
	};
	data: any;
	parser: Parser;
	original: string;
	constructor(data: any, ctx: { [key: string]: string }, original: string, parser: Parser) {
		this.ctx = ctx;
		this.data = data;
		this.parser = parser;
		this.original = original
	}
	async run() {
		let final = stripIndents(this.original)
		for(const template of this.data.templates) {
			const templateToBeReplaced = template.raw;
			const type = template.data.type;
			let result: string | null = ''
			let handler = getHandler(type)
			result = await handler(this.ctx, template.data, this);
			if(type == exp_types.string || type == exp_types.variables) result = makeString(this.ctx, result as string, this)
			final = final.replace(templateToBeReplaced, result || '')
		}
		return stripIndents(final);
	}
	throwError(msg: string) {
		return this.parser.throwError(msg)
	}
}

export default Runner;