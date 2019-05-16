// declaration.d.ts
declare module '*.scss' {
    const content: {[className: string]: string};
    export default content;
}

declare module '!raw-loader!*' {
	const contents: string
	export = contents
}