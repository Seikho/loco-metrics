var date = new Date();
var defaultOutput = `${date.getUTCFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getSeconds()}`;


var options: Options = {
	frequency: 1,
	stereotypic: false,
	input: '',
	output: defaultOutput
}

export function frequency(value) {
	var freq = Math.abs(Number(value));
	if (freq < 1) {
		throw new Error('Invalid sample frequency provided. Must be above 0');
	}

	options.frequency = freq;
	return freq;
}

export function output(filename) {
	if (filename.length > 0) options.output = filename;
	return filename;
}


