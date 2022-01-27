const createError = (errorName: string) => {
	return class CustomError extends Error {
		constructor(functionName: string, msg: string) {
			super(msg)
			this.name = `${errorName}-[${functionName}]`
		}
	}
}

const ParseError = createError('ParseError')
const ValidationError = createError('ValidationError')

export {
	ParseError,
	ValidationError
}