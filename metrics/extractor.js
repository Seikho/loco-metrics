var path = require('path');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var Extractor = (function () {
    function Extractor(options) {
        this.options = options;
        this.callback = null;
        this.prev = null;
        this.succ = null;
        this.samples = [];
        this.aggregateCount = 0;
        this.aggregateSampleCount = 0;
        this.aggregates = [];
        this.sampleCount = 0;
        this.currentBin = 1;
        this.samplesPerBin = 0;
        this.metric = 'metric';
        this.samplesPerBin = this.options.frequency * 60 * this.options.bin;
    }
    Extractor.prototype.read = function () {
        var _this = this;
        this.samples = [];
        var read = fs.createReadStream(this.options.input);
        var write = new stream.Writable();
        var p = new Promise(function (resolve) {
            read.on('end', function () {
                _this.process();
                resolve();
                if (_this.callback)
                    _this.callback();
            });
        });
        var rl = readline.createInterface({
            input: read,
            output: write
        });
        rl.on('line', function (line) {
            var line = line.toString().trim();
            if (line.length < 40)
                return;
            _this.samples.push(_this.toSample(line));
        });
        return p;
    };
    Extractor.prototype.process = function () {
        var _this = this;
        this.samples.forEach(function (datum) {
            _this.sampleCount++;
            _this.aggregateSampleCount++;
            _this.prev = _this.succ;
            _this.succ = datum;
            _this.parse(datum.sample);
            _this.updateCurrentBin();
        });
    };
    Extractor.prototype.updateCurrentBin = function () {
        var oldBin = this.currentBin;
        // Start from 1
        var isNewBin = this.sampleCount % this.samplesPerBin === 0 && this.sampleCount > 0;
        if (!isNewBin)
            return false;
        this.aggregates.push({ counts: this.aggregateCount, sample: this.aggregateSampleCount });
        this.aggregateCount = 0;
        this.aggregateSampleCount = 0;
        this.currentBin++;
        return true;
    };
    Extractor.prototype.save = function (callback) {
        var _this = this;
        this.callback = callback;
        return this.read()
            .then(function () {
            var lines = [
                _this.metric,
                ("Input file: " + path.basename(_this.options.input)),
                ("Samples per bin: " + _this.samplesPerBin + " | Sample Frequency: " + _this.options.frequency + " | Total Samples: " + _this.samples.length),
                "Bin#\tCounts\tSamples"
            ];
            _this.aggregates.forEach(function (val, i) { return lines.push((i + 1) + "\t" + val.counts + "\t" + val.sample); });
            if (_this.aggregateCount > 1) {
                lines.push((_this.aggregates.length + 1) + "\t" + _this.aggregateCount + "\t" + _this.aggregateSampleCount);
            }
            var filename = _this.getFilename();
            fs.writeFileSync(filename, lines.join('\n'));
            console.log("Saved to " + filename);
            return filename;
        });
    };
    Extractor.prototype.getFilename = function () {
        var measure = this.metric.toLowerCase().replace(' ', '_');
        var filename = this.options.output + "-" + measure + ".dat";
        if (!this.fileExists(filename)) {
            return filename;
        }
        var count = 1;
        while (true) {
            filename = this.options.output + "-" + measure + "_" + count + ".dat";
            if (!this.fileExists(filename)) {
                return filename;
            }
            count++;
        }
    };
    Extractor.prototype.fileExists = function (filename) {
        try {
            fs.statSync("" + filename);
            return true;
        }
        catch (ex) {
            return false;
        }
    };
    Extractor.prototype.toSample = function (rawData) {
        var split = rawData.split(' ');
        var sample = {
            date: new Date(split[0] + " " + split[1] + " " + split[2]),
            sample: split[4].split('').map(function (n) { return Number(n); })
        };
        return sample;
    };
    Extractor.prototype.equals = function (left, right) {
        return left.every(function (value, index) { return value === right[index]; });
    };
    Extractor.prototype.isRearing = function (sample) {
        var rearingValue = sample ? sample[7] : this.succ.sample[7];
        return rearingValue === 1;
    };
    return Extractor;
})();
module.exports = Extractor;
