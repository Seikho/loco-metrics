var Commander = require('commander');
var metrics = require('./metrics');
var date = new Date();
var defaultOutput = date.getUTCFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getSeconds();
var options = {
    bin: 5,
    frequency: 1,
    stereotypic: 0,
    input: '',
    output: defaultOutput
};
function frequency(value) {
    var freq = Math.abs(Number(value));
    if (freq < 1) {
        throw new Error('Invalid sample frequency provided. Must be <= 1');
    }
    options.frequency = freq;
    return freq;
}
exports.frequency = frequency;
function output(filename) {
    if (filename.length > 0)
        options.output = filename;
    return filename;
}
exports.output = output;
function stereotypic(value) {
    var error = Math.abs(Number(value));
    if (error < 1) {
        throw new Error('Invalid stereotypic error provided. Must be <= 1');
    }
    options.stereotypic = error;
    return stereotypic;
}
exports.stereotypic = stereotypic;
function bin(value) {
    var binValue = Math.abs(Number(value));
    if (binValue < 1) {
        throw new Error('Invalid bin value provided. Must be <= 1');
    }
    options.bin = binValue;
    return binValue;
}
exports.bin = bin;
function run() {
    var input = Commander.args[0];
    if (!input) {
        console.log('No input file was provided. See `loco-metrics --help`');
        return;
    }
    options.input = input;
    if (options.stereotypic) {
        new metrics.stereotypic(options).save();
    }
}
exports.run = run;
