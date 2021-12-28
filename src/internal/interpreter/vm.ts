import { VM } from 'vm2';

const vm = new VM({
	timeout: 9000,
	eval: false,
});


export const updateVM = (ctx: any) => {
//	console.log('updated vm:', ctx)
	return vm.setGlobals(ctx);
}

export default vm;