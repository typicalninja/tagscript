export const makeString = (ctx: any, string: string) => {
	// slice off the start and end of the string which will be [', "]
	string = string.slice(1, -1);
	// ads support for strings of form "...something c $key1 $key2"
	Object.keys(ctx).forEach((key) => {
		if(ctx[key] && typeof ctx[key] == 'string') {
			const regex = new RegExp(`\\$${key}`, 'g')
			string = string.replace(regex, ctx[key])
		}
	});

	// return the replaced string
	return string;
}