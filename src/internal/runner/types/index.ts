const handlerForType: { [key: string]: Function } = {
	TYPE_DECLARATION: require('./variables').handler_DEC,
	TYPE_VARIABLE: require('./variables').handler_VAR,
	TYPE_FUNCTION_W_PARAM: require('./function').handler_FUNC,
	TYPE_FUNCTION_N_PARAM: require('./function').handler_FUNC
}
export default (type: string) => {
	return handlerForType[type] || (() => { })
}