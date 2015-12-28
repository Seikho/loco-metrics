import fs = require('fs');
import readline = require('readline');
import stream = require('stream');
export = Extractor;

abstract class Extractor {
	constructor(public options: Options) {
        this.samplesPerBin = this.options.frequency * 60 * this.options.bin;
	}
	
    private callback: () => void = null;
	protected prev: Sample = null;
	protected succ: Sample = null;
    protected samples: Array<Sample> = [];
    
    protected aggregate = 0; 
    private aggregates = [];
    
    private sampleCount = 0;
    private currentBin = 1;
    private samplesPerBin = 0;
    
	public metric: string = 'metric';
    
    
    read() {
        this.samples = [];
        var read = fs.createReadStream(this.options.input);
        var write = new stream.Writable();
        
        read.on('end', () => {
            this.process();
            if (this.callback) this.callback();
        });
        
        var rlo: readline.ReadLineOptions;
        var rl = readline.createInterface({
            input: read,
            output: write
        });
        
        rl.on('line', line => this.samples.push(this.toSample(line)));
    }

	process() {         
        
		this.samples.forEach(datum => {
            this.sampleCount++;
            var isNewBin = this.updateCurrentBin();
            
            if (isNewBin) {
                this.aggregates.push(this.aggregate);
                this.aggregate = 0;
            }
            
			this.prev = this.succ;
			this.succ = datum;
			this.parse(datum.sample);
		});
	}
    
    updateCurrentBin() {
        var oldBin = this.currentBin;
        
        // Start from 1
        this.currentBin = Math.ceil(this.sampleCount / this.samplesPerBin);
        
        return oldBin === this.currentBin;
    }
	
	save(callback?: () => void) {
        this.callback = callback;
		this.read();
	}
    
    toSample(rawData: string) {
        var split = rawData.split(' ');
        var sample: Sample = {
            date: new Date(`${split[0]} ${split[1]} ${split[2]}`),
            sample: split[4].split('').map(n => Number(n))
        }
        
        return sample;
    }
    
    equals(left: number[], right: number[]) {
        return left.every((value, index) => value === right[index]);
    }
    
    isRearing(sample?: number[]) {
        var rearingValue = sample ? sample[7] : this.succ.sample[7];
        return rearingValue === 1;
    }

	abstract parse(sample: number[]): void;
}
