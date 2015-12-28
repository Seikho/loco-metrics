var Promise = require('bluebird');
var rl = require('readline');
var fs = require('fs');
function parse(filename) {
    var p = new Promise(function (resolve, reject) {
        var input = fs.createReadStream(filename);
        input.on('close', function () { return resolve(rawLines.map(parseLine)); });
        var rawLines = [];
        var read = rl.createInterface({ input: input, output: process.stdout });
        read.on('line', function (line) { return rawLines.push(line); });
        read.on('error', function (err) { return reject(err); });
    });
    return p;
}
function parseLine(rawLine) {
    var line;
    var split = rawLine.split('');
    var date = new Date(split.slice(0, 3).join(' '));
    var sample = split.slice(-1)[0];
    return {
        date: date,
        sample: sample
    };
}
module.exports = parse;
