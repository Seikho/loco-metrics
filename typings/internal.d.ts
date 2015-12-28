interface Options {
	frequency: number;
	stereotypic: number;
	input: string;
	output: string;
    bin: number;
}

interface Sample {
	date: Date;
	sample: Array<number>;
}

declare module "commander" {
    var output: string;
    var frequency: number;
    var stereo: number;
    var args: string[];
}