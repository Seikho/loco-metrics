import Extractor = require('./extractor');
export = Sterotypic;

class Sterotypic extends Extractor {
    constructor(options: Options) {
        super(options);
        
        this.metric = 'stereotypic';
    }
    
    private count: number = 0;
    
    private first: number[];
    private second: number[];
        
    parse(sample: number[]) {
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
        
        this.aggregate++;
    }
    
    isRepeated(sample: number[]) {
        return this.equals(sample, this.first) || this.equals(sample, this.second);
    }
    
    reset() {
        this.first = null;
        this.second = null;
        this.count = 0;
    }
    
}
