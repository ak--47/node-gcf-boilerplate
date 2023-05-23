/* eslint-disable no-debugger */
import { main } from "./index.js";

/** @type {import('./index.d.ts').Config} */
const config = {
	foo: "forty two",
	bar: 42,
	baz: false,
};

main(config, true)
	.then((d) => {
		return d;
	})
	.catch((e) => {
		e;
		debugger;
	});
