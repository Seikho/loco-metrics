#!/usr/bin/env node
const cmd = require('commander');
const pkg = require('../package.json');
const parser = require('..');

cmd
	.version(pkg.version)
	.usage('[options] <raw file>')
	.option('-o, --output <filename>', 'Output filename prefix. Saves metrics as <filename>-<metric>.dat', parser.output)
	.option('-f, --frequency <number>', 'Sample frequency in hertz. Defaults to 1', parser.frequency)
	.option('-s, --stereo <error>', 'Stereotypic movement with <error> sample error. Outputs <filename>-stereotypic.dat', parser.stereotypic)	
	.parse(process.argv);

parser.run(cmd.args);
