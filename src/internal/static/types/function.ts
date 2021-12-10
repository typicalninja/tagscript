/**
 * TYPE: FUNCTION
 * START: (
 * END: )
 */


// a function starts with a (
export const start = ['('];
// a function ends with a  )
export const end = [')'];

// create regexps for the start and end of a function
export const regexps = start.map((item, int) => {
	return new RegExp(`^[a-zA-Z]+\\${item}[^)]*?\\)?\\${end[int]}`, 'im')
})

export const functionParamsRegex = /\((.*?)\)/ig

// checks if given string is of this type
export const test = (str: string) => {
	return regexps.some((item) => {
		return item.test(str)
	})
}

// checks if the function string is empty () = empty && (param, param2) = not empty
export const hasParams = (str: string) => {
	return !(/^[a-zA-Z]+\(\)$/.test(str))
}

