import rl = require('readline');
import fs = require('fs');
export = parse;

async function parse(filename: string) {
	var p = new Promise<{ date: Date, sample: string }[]>((resolve, reject) => {
		
		var input = fs.createReadStream(filename);
		input.on('close', () => resolve(rawLines.map(parseLine)));

		var rawLines: string[] = [];
		var read = rl.createInterface({ input, output: process.stdout });
		read.on('line', line => rawLines.push(line));
		read.on('error', err => reject(err));
	});

	return p;
}

function parseLine(rawLine: string) {
	var line: { date: Date, sample: string };

	var split = rawLine.split('');
	var date = new Date(split.slice(0, 3).join(' '));
	var sample = split.slice(-1)[0];

	return {
		date,
		sample
	}	
}
