import { VM } from 'vm2';

const vm = new VM({
	timeout: 5000,
	eval: false,
	wasm: false,
});


export const updateVM = (ctx: any) => {
	Object.keys(ctx).forEach(key => {
		vm.freeze(ctx[key], key)
	})
	return ctx;
	//return vm.setGlobals(ctx);
}

export default vm;