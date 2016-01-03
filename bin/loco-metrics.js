#!/usr/bin/env node
const parser = require('..');
const pkg = require('../package.json');
var cmd = require('commander');

cmd
	.version(pkg.version)
	.usage('[options] <input data file>')
	.option('-o, --output <filename>', 'Output filename prefix. Saves metrics as <filename>-<metric>.dat', parser.output)
	.option('-f, --frequency <number>', 'Samples per minute. Defaults to 115', parser.frequency)
	.option('-s, --stereo <error>', 'Stereotypic movement with <error> sample error. Outputs <filename>-stereotypic.dat', parser.stereotypic)
    .option('-b, --bin <minutes>', 'Number of samples in each bin measured in minutes. Defaults to 5', parser.bin)	
	.parse(process.argv);
    
parser.run();