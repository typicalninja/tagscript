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


export const condition_types = {
	equal: 'TYPE_CONDITION_EQUAL',
	strict_equal: 'TYPE_CONDITION_STRICT_EQUAL',
	greater: 'TYPE_CONDITION_GREATER',
	lesser: 'TYPE_CONDITION_LESS',
	greater_equal: 'TYPE_CONDITION_GREATER_EQUAL',
	lesser_equal: 'TYPE_CONDITION_LESS_EQUAL',
	unknown: 'TYPE_CONDITION_UNKNOWN'
}

export const templateRegex = /{(.*?)}/gis