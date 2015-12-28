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
        this.metric = 'metric';
    }
    Extractor.prototype.read = function () {
        var _this = this;
        this.samples = [];
        var read = fs.createReadStream(this.options.input);
        var write = new stream.Writable();
        read.on('end', function () {
            _this.process();
            if (_this.callback)
                _this.callback();
        });
        var rlo;
        var rl = readline.createInterface({
            input: read,
            output: write
        });
        rl.on('line', function (line) { return _this.samples.push(_this.toSample(line)); });
    };
    Extractor.prototype.process = function () {
        var _this = this;
        this.samples.forEach(function (datum) {
            _this.prev = _this.succ;
            _this.succ = datum;
            _this.parse(datum.sample);
        });
    };
    Extractor.prototype.save = function (callback) {
        this.callback = callback;
        this.read();
    };
    Extractor.prototype.toSample = function (rawData) {
        var split = rawData.split(' ');
        var sample = {
            date: new Date(split[0] + " " + split[1] + " " + split[2]),
            sample: split[4].split('').map(function (n) { return Number(n); })
        };
        return sample;
    };
    return Extractor;
})();
module.exports = Extractor;
