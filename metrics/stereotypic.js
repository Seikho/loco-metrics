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
        this.metric = 'stereotypic';
    }
    Sterotypic.prototype.parse = function (sample) {
        if (sample[7] === 0)
            return;
        console.log(++this.count, sample);
    };
    return Sterotypic;
})(Extractor);
module.exports = Sterotypic;
