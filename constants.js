module.exports.defaultOptions = {
	ctx: {
		functions: {
		},
		variables: {
		},
		features: {
		},
	},
	reserved: ['if']
}

// regex used to identify the type of a tag
module.exports.regex = {
	variableDeclaration: /^[a-zA-Z]+\s*=\s*[a-zA-Z\d]+\(?[^)]*\)?/im,
	function: /^[a-zA-Z]+\([^)]*?\)?\)/gim,
	main: /{(.*?)}/gis,
	// gets whats inside the function params "()"
	functionParams: /\((.*?)\)/ig,
	ifCondition: /^if\([^)]*\):\s*.*?\s*:/gi,
	// only gets the condition of the if statement
	if_Condition: /^if\s*\(.*?\)/gi,
	elseCondition: /^else\s*:\s*.*?\s*:/gi,
	elseIfCondition: /^else\s*if\s*\(.*?\)\s*:\s*.*?\s*:/gi,
	// condition of the if/else if/else statement
	condition: /\(.*?\)/gi,
	
}