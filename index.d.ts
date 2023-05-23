export interface Config {
	foo: string;
	[other: string]: any;
}

/**
 * this is my main thing!
 * @param  {import('./index.d.ts').Config} config
 * @param  {boolean} isLocal=false
 */
export function main(config: Config, isLocal: Boolean): Promise<any>;
