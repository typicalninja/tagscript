import { getStaticProps } from "../../../..";
import Interpreter from "../interpreter";
import vm from "../vm";


export const runCondition = (condition: string) => {
	let result = false;
	try {
		result = Boolean(vm.run(condition));
	} catch { 
		result = false; 
	}
	return result;
}

export const runCode = async (code: string, ctx: any, interpreter: Interpreter) => {
	code = code.split(';').filter(c => c).map(c => `{${c}}`).join('\n')
	const data = getStaticProps(code, interpreter.parser);
	const result = new Interpreter(data, ctx, code, interpreter.parser);

	return (await result.run());
}

export const run_IF = async (ifData: any, ctx: any, interpreter: Interpreter) => {
	const condition = ifData.condition 
	const toRun = ifData.run
	const r = runCondition(condition)
	//console.log('r:', r, 'toRUn:', toRun)
	if(r == true) {
		let result = await runCode(toRun, ctx, interpreter)
		if(result) return result
		else return true
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
			const r = runCondition(condition)
			if(r == true) {
				return (await runCode(toRun, ctx, interpreter))
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
	const ifResult = await run_IF(conditionData.IF, ctx, runner)
	//console.log('ifResult:', ifResult)
	if(ifResult) return '';
	else {
		if(conditionData.ELSE_IFS.length) {
			const elseIfResult = await run_ELSEIF(conditionData.ELSE_IFS, ctx, runner)
			if(elseIfResult) return elseIfResult;
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