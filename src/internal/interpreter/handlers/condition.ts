import { getStaticProps } from "../../../..";
import Interpreter from "../interpreter";
import { condition_types, exp_types } from "../../constants";
import { cleanString } from "../../utils";



export const runCondition = (conditionData: { type: string, operator: string, items: { type: string, raw: string }[] }, ctx: any) => {
	const type = conditionData.type;
	if(type == condition_types.unknown) return false;
	const leftSide = conditionData.items[0];
	const rightSide = conditionData.items[1];
	let result = false;
	
	let item1;
	let item2;

	if(leftSide.type == exp_types.unknown || leftSide.type == exp_types.variables) {
		const r = cleanString(leftSide.raw)
		if(!isNaN(r)) {
			item1 = Number(r)
		}
		else {
			item1 = ctx[r]
		}
	}
	else if(leftSide.type == exp_types.string){
		item1 = leftSide.raw;
	}

	if(rightSide.type == exp_types.unknown || rightSide.type == exp_types.variables) {
		const r = cleanString(rightSide.raw)
		if(!isNaN(r)) {
			item2 = Number(r)
		}
		else {
			item2 = ctx[r]
		}
	}
	else if(rightSide.type == exp_types.string){
		item2 = rightSide.raw;
	}

	//console.log('item1', item1, 'item2', item2, rightSide, leftSide, type)

	switch(type) {
		case condition_types.equal:
			result = item1 == item2
		//	console.log('equal:', result, 'item1', item1, 'item2', item2)
		break;
		case condition_types.strict_equal:
			result = item1 === item2
		//	console.log('sequal:', result, 'item1', item1, 'item2', item2)
		break;
		case condition_types.greater:
			result = item1 > item2
		//	console.log('greater', result, 'item1', item1, 'item2', item2)
		break;
		case condition_types.greater_equal:
			result = item1 >= item2
		break;
		case condition_types.lesser:
			result = item1 < item2
		break;
		case condition_types.lesser_equal:
			result = item1 <= item2
		break;
	}
	return Boolean(result);
}

/*
OLD:
	let result = false;
	try {
		result = Boolean(vm.run(condition));
	} catch(err) { 
		result = false; 
	}
	return result;
*/

export const runCode = async (code: string, ctx: any, interpreter: Interpreter) => {
	code = code.split(';').filter(c => c).map(c => `{${c}}`).join('\n')
	const data = getStaticProps(code, interpreter.parser);
	const result = new Interpreter(data, ctx, code, interpreter.parser);

	return (await result.run());
}

export const run_IF = async (ifData: any, ctx: any, interpreter: Interpreter) => {
	if(!ifData) return 'RAN'
	const condition = ifData.condition 
	const toRun = ifData.run
	const r = runCondition(condition, ctx)
	//console.log('r:', r, 'toRUn:', toRun, 'condition:', condition)
	if(r == true) {
		let result = await runCode(toRun, ctx, interpreter)
		if(result) return result
		else return 'RAN'
	}
	return null;
}

// There can be multiple ELse Ifs
export const run_ELSEIF = async (elseifData: any, ctx: any, interpreter: Interpreter) => {
	// elseIfData is an array of objects
	// run through each one and see if the conditions return true
	// if they do run the code under that condition and return the result
	// if non of the elseIFs return true, at the end return null so we can run else code if present
	for(const elseIF of elseifData) {
		const condition = elseIF.condition
		const toRun = elseIF.run
		if(toRun) {
			const r = runCondition(condition, ctx)
			if(r === true) {
				return (await runCode(toRun, ctx, interpreter)) || 'RAN'
			}
		}
	}
	return null;
}

export const run_ELSE = async (elseData: any, ctx: any, interpreter: Interpreter) => {
	const toRun = elseData.run
	if(toRun) {
		return (await runCode(toRun, ctx, interpreter));
	}
}

export const handler_CONDITION = async (ctx: any, conditionData: any, runner: Interpreter) => {
	// 1st step: run the if condition and if condition returns true run the corresponding code and return '' (empty string) || result
	const ifResult = await run_IF(conditionData.IF, ctx, runner)
	//console.log('ifResult:', ifResult)
	if(ifResult) return (ifResult === 'RAN' ? '' : ifResult) || '';
	else {
		if(conditionData.ELSE_IFS.length) {
			const elseIfResult = await run_ELSEIF(conditionData.ELSE_IFS, ctx, runner)
		//	console.log('elseIFreslt', elseIfResult)
			if(elseIfResult) return (elseIfResult === 'RAN' ? '' : elseIfResult) || '';
			else {
				if(conditionData.ELSE) {
					const elseResult = await run_ELSE(conditionData.ELSE, ctx, runner)
					if(elseResult) return elseResult;
				}
				else {
					return ''
				}
			}
		}
		else {
			if(conditionData.ELSE) {
				const elseResult = await run_ELSE(conditionData.ELSE, ctx, runner)
				if(elseResult) return elseResult;
			}
			else {
				return ''
			}
		}
	}
}