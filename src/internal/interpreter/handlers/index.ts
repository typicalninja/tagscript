import Interpreter from "../interpreter"

const handlerForType: { [key: string]: Function } = {
	TYPE_DECLARATION: require('./variables').handler_DEC,
	TYPE_VARIABLE: require('./variables').handler_VAR,
	TYPE_FUNCTION_W_PARAM: require('./function').handler_FUNC,
	TYPE_FUNCTION_N_PARAM: require('./function').handler_FUNC,
	TYPE_STRING: require('./string').handler_STR
}
export default (type: string, Interpreter: Interpreter) => {
	return handlerForType[type] || Interpreter.parser.extensionManager.getInterpreterExtension(type)
}