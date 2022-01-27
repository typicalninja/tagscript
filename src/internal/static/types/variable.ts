/**
 * TYPE: variables declaration
 */

// ! old: export const regexp = /^[a-zA-Z]+\s*=\s*[a-zA-Z\d]+\(?[^)]*\)?/im

export const regexp = /^[a-zA-Z]+\s*?=\s*?["-']?[a-zA-Z\d]+["']?\(?[^)]*\)?/im

export const test = (str: string) => {
	return regexp.test(str)
}