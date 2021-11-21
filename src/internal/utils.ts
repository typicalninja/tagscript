const isObject = (object: any) => {
	return !!object && typeof object === 'object';
}
// deep merges something mostly a object with some internal values
const merge = (target: any, source: any) => {
	if (!isObject(target) || !isObject(source)) {
	  return source;
	}
  
	Object.keys(source).forEach(key => {
	  const targetValue = target[key];
	  const sourceValue = source[key];
  
	  if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
		target[key] = targetValue.concat(sourceValue);
	  } else if (isObject(targetValue) && isObject(sourceValue)) {
		target[key] = merge(Object.assign({}, targetValue), sourceValue);
	  } else {
		target[key] = sourceValue;
	  }
	});
  
	return target;
}


// removes new lines "\n" of a string
const removeNewLines = (string: string) => {
	return string.replace(/\n/g, '');
}

// we are using github copilot
// strips indent from a string
// behaves like common-tags' stripIndents
// removes every whitespace from a string
const stripIndents = (text: any) => {
		if (typeof text !== 'string') {
			text = String(text);
		}
		return text.replace(/^\s+|\s+$/gm, '').replace(/\n+/g, '\n').replace(/\t+/g, '\t').trim();
}


const cleanString = (string: any) => {
		if (typeof string !== 'string') {
			string = String(string);
		}
		string = removeNewLines(string);
		string = stripIndents(string);
		return string;
}



export {
	isObject,
	merge,
	removeNewLines,
	stripIndents,
	cleanString
}