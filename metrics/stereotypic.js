var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Extractor = require('./extractor');
var Sterotypic = (function (_super) {
    __extends(Sterotypic, _super);
    function Sterotypic(options) {
        _super.call(this, options);
        this.count = 0;
        this.metric = 'Stereotypic Movement';
    }
    Sterotypic.prototype.parse = function (sample) {
        if (this.first == null) {
            this.first = sample;
            return;
        }
        if (this.second == null) {
            if (this.equals(sample, this.prev.sample)) {
                return;
            }
            this.second = sample;
            return;
        }
        if (!this.isRepeated(sample)) {
            this.reset();
            return;
        }
        var stillTooLong = this.equals(sample, this.prev.sample) && this.count === this.options.stereotypic;
        if (stillTooLong) {
            this.reset();
            return;
        }
        var hasntMoved = this.equals(sample, this.prev.sample);
        if (hasntMoved) {
            this.count++;
            return;
        }
        this.aggregateCount++;
    };
    Sterotypic.prototype.isRepeated = function (sample) {
        return this.equals(sample, this.first) || this.equals(sample, this.second);
    };
    Sterotypic.prototype.reset = function () {
        this.first = null;
        this.second = null;
        this.count = 0;
    };
    return Sterotypic;
})(Extractor);
module.exports = Sterotypic;
