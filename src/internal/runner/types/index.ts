const handlerForType: { [key: string]: any } = {
	TYPE_DECLARATION: require('./variables').handler_DEC,
	TYPE_VARIABLE: require('./variables').handler_VAR,
}
export default (type: string) => {
	return handlerForType[type] || (() => { })
}