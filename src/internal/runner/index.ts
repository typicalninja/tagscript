import Parser from "../../parser";
import { stripIndents } from 'common-tags'
import { exp_types } from "../constants";
import { default as getHandler } from './types/index'

class Runner {
	ctx: any;
	data: any;
	parser: Parser;
	original: string;
	constructor(data: any, ctx: any, original: string, parser: Parser) {
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
			let result = ''
			let handler = null
			console.log(template.data)
			switch(type) {
				case exp_types.declaration: 
					 handler = getHandler(type)
				break;
				case exp_types.variables:
					handler = getHandler(type)
				break;
			}

			result = await handler(this.ctx, template.data, this)
			final = final.replace(templateToBeReplaced, result || '')
		}
		return stripIndents(stripIndents(final));
	}
	throwError(msg: string) {
		return this.parser.throwError(msg)
	}
}

export default Runner;