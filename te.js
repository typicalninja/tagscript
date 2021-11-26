const l = `$(f) $(f222222222e)`

console.log(l.match(/\$\((.*?)\)/g).map(s => s.slice(2, -1)));

for(let key of Object.keys(ctx)) {
	// ensure even number gets => to strings
	if(typeof key !== string) key = String(key)
	if(ctx[key]) {
		let value = ctx[key];
		// convert the value to a string if its not
		if(typeof value !== 'string') value = util.inspect(value)
		//console.log('val:', value, key);
		const regex = new RegExp(`\\$${key}`, 'g')
		// replace all of the vals in the string
		string = string.replace(regex, value)
		// console.log('string:', string, value)
	}
}
