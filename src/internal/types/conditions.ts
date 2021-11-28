/**
 * TYPE: CONDITION
 * START: if | :else if | :else
 * END: :
 */

export const start = ['if', ':else\\s*if', ':else'];
export const end = [':'];

const regexps = start.map((start, i) => {
	// else does not contain the "()"
	return i !== 2 ? new RegExp(`^${start}\\s*\\([^)]*\\):\\s*.*?\\s*:`, 'gim') : new RegExp(`^:else\\s*:\\s*.*?\\s*:`, 'gim')
});

// tests weather one of the above regexps matches
export const test = (str: string) => {
	return regexps.some((regexp) => {
		return regexp.test(str);
	});
}


export const match = (str: string) => {
	const matches: string[] = [];
	regexps.forEach(r => {
		const match_ = str.match(r);
		if(match_) {
			const match = match_[0];
			matches.push(match);
		}
	});

	return matches
}