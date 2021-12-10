/**
 * TYPE: string
 * START: " || '
 * END: " || '
 */

// strings starts with a " or a '
export const start = [`"`, `'`];
// strings ends with a " or a '
export const end = [`"`, `'`];
// create regexps for the start and end of a string
export const regexps = start.map((item, int) => {
	return new RegExp(`^${item}[^${item}]*${end[int]}`, 'im')
});

export const test = (str: string) => {
	return regexps.some((item) => {
		return item.test(str);
	});
}