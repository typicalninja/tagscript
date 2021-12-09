export const defaultOptions = {
	globalCtx: {},
	throwError: false,
}


export const exp_types = {
	string: 'TYPE_STRING',
	function: 'TYPE_FUNCTION',
	function_withParams: 'TYPE_FUNCTION_W_PARAM',
	function_withoutParams: 'TYPE_FUNCTION_N_PARAM',
	unknown: 'TYPE_UNKNOWN',
	variables: 'TYPE_VARIABLE',
	declaration: 'TYPE_DECLARATION',
	condition: 'TYPE_CONDITION'
}

export const templateRegex = /{(.*?)}/gis