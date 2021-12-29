/**
 * TYPE: CONDITION
 * START: if | :else if | :else
 * END: :
 */
import { getTypes } from './index'

// .... - We just provide the regex directly
export const start = ['\\s*?if', '\\s*?elseIF', '....'];
export const end = [':'];

 const conditionRegex = /\([^)]*\)/gi
 const conditionCodeRegex = /:(.*?):/gi

 // equals
 const CONDITION_L_EQUAL = /'?[a-zA-Z]+'?\s+?==\s+?[a-zA-Z]+/gm
 const CONDITION_S_EQUAL = /'?[a-zA-Z]+'?\s+?===\s+?[a-zA-Z]+/gm
 // numeric
 const CONDITION_GREATER = /'?[a-zA-Z]+'?\s+?>\s+?[a-zA-Z]+/gm
 const CONDITION_LESS = /'?[a-zA-Z]+'?\s+?>\s+?[a-zA-Z]+/gm

 const CONDITION_GREATER_EQUAL = /'?[a-zA-Z]+'?\s+?>=\s+?[a-zA-Z]+/gm
 const CONDITION_LESS_EQUAL = /'?[a-zA-Z]+'?\s+?<=\s+?[a-zA-Z]+/gm

export const regexps = start.map((start, i) => {
	// else does not contain the "()"
	return i !== 2 ? new RegExp(`${start}\\([^)]*\\):\\s*.*?\\s*:`, 'gm') : /else:\s*.*?\s*:/gi
});


// tests weather one of the above regexps matches
export const test = (str: string) => {
	 return regexps.some((regexp) => {
		 return regexp.test(str);
	 });
}

export const match = (str: string) => {
	const matches = [];
	for(const regex of regexps) {
	   const m = str.match(regex)
	   if(m) {
			for(let match of m) {
				matches.push(match.replace(/\n|\r/g, ''));
			}
	   }
	}
	return matches
}

export const getConditionData = (str: string) => {
	// create a object to attach the final data to
	const data = Object.create(null)
	// determine the type using regex's we defined above
	const type = (CONDITION_GREATER_EQUAL.test(str) ? 'TYPE_CONDITION_GREATER_EQUAL' : false) || (CONDITION_GREATER.test(str) ? 'TYPE_CONDITION_GREATER' : false) || (CONDITION_LESS_EQUAL.test(str) ? 'TYPE_CONDITION_LESS_EQUAL' : false) || (CONDITION_LESS.test(str) ? 'TYPE_CONDITION_LESS' : false) || (CONDITION_L_EQUAL.test(str) ? 'TYPE_CONDITION_EQUAL' : false) || (CONDITION_S_EQUAL.test(str) ? 'TYPE_CONDITION_STRICT_EQUAL' : false) || 'TYPE_CONDITION_UNKNOWN'
	// determine the operator using the type
	const splitItem = type === 'TYPE_CONDITION_EQUAL' ? '==' : type === 'TYPE_CONDITION_STRICT_EQUAL' ? '===' : type === 'TYPE_CONDITION_GREATER' ? '>' :  type === 'TYPE_CONDITION_GREATER_EQUAL' ? '>=' : type === 'TYPE_CONDITION_LESS' ? '<' : type === 'TYPE_CONDITION_LESS_EQUAL' ? '<=' : '';
	// split from the operator to get the 2 parts of a condition
	const splitted = str.split(splitItem)

	Object.defineProperties(data, {
		type: { value: type, enumerable: true, writable: false },
		operator: { value: splitItem, enumerable: true, writable: false },
		items: { value: type === 'TYPE_CONDITION_UNKNOWN' ? [] : splitted.map(sp => ({ type: getTypes(sp, null), raw: sp, })), enumerable: true, writable: false }
	});

	return data;
 }


// parses a string that was identified as a if / else if / else chain and returns all related data
export const parseChain = (str: string) => {
	const matches = match(str)
	const PRE_IF = regexps[0].test(matches[0]) ? matches[0] : null
	if(!PRE_IF) return null
	const PRE_ELSE = regexps[2].test(matches[matches.length - 1]) ? matches[matches.length - 1] : null
	matches.shift()
	// if ELse is present then the last element is the else, remove it so only ELSE_IFs remain
	if(PRE_ELSE) matches.pop()
	let PRE_ELSEIF;
	if(matches.length) {
		PRE_ELSEIF = matches.filter(m => m.match(regexps[1]))
	}
	const data = {
		IF: {},
		ELSE_IFS : [] as {}[],
		ELSE: {}
	};
	Object.defineProperties(data.IF, {
		condition: { value: getConditionData(PRE_IF.match(conditionRegex)![0]?.slice(1, -1)), enumerable: true },
		raw: { value: PRE_IF, enumerable: true },
		run: { value: PRE_IF.match(conditionCodeRegex)![0].slice(1, -1)?.replace(' ', ''), enumerable: true }
	});

	if(PRE_ELSE) {
		if(!PRE_ELSE.match(conditionCodeRegex)) return;
		Object.defineProperties(data.ELSE, {
			raw: { value: PRE_ELSE, enumerable: true },
			run: { value: PRE_ELSE.match(conditionCodeRegex)![0]?.slice(1, -1)?.replace(' ', ''), enumerable: true }
		});
	}

	if(PRE_ELSEIF) {
		for(const match of PRE_ELSEIF) {
			const final = Object.create(null);
			const _condition = match.match(conditionRegex)![0]
			const _code = match.match(conditionCodeRegex)![0]
			if(_condition && _code) {
			Object.defineProperties(final, {
				condition: { value: getConditionData(_condition?.slice(1, -1)), enumerable: true },
				raw: { value: match, enumerable: true },
				run: { value: _code.slice(1, -1)?.replace(' ', ''), enumerable: true }
			});
			data.ELSE_IFS.push(final);
		}
		}
	}
	return data
}

