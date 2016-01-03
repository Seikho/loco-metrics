import path = require('path');
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

    protected aggregateCount = 0;
    private aggregateSampleCount = 0;
    private aggregates: Array<{ counts: number, sample: number }> = [];

    private sampleCount = 0;
    private currentBin = 1;
    private samplesPerBin = 0;

    public metric: string = 'metric';

    read() {
        this.samples = [];
        var read = fs.createReadStream(this.options.input);
        var write = new stream.Writable();

        var p = new Promise<void>(resolve => {
            read.on('end', () => {
                this.process();
                resolve();
                if (this.callback) this.callback();
            });

        });

        var rl = readline.createInterface({
            input: read,
            output: write
        });

        rl.on('line', line => {
            var line = line.toString().trim();
            if (line.length < 40) return;
            this.samples.push(this.toSample(line))
        });

        return p;
    }

    process() {
        this.samples.forEach(datum => {
            this.sampleCount++;
            this.aggregateSampleCount++;

            this.prev = this.succ;
            this.succ = datum;
            this.parse(datum.sample);

            this.updateCurrentBin();
        });
    }

    updateCurrentBin() {
        var oldBin = this.currentBin;
        
        // Start from 1
        var isNewBin = this.sampleCount % this.samplesPerBin === 0 && this.sampleCount > 0;
        if (!isNewBin) return false;

        this.aggregates.push({ counts: this.aggregateCount, sample: this.aggregateSampleCount });
        this.aggregateCount = 0;
        this.aggregateSampleCount = 0;
        this.currentBin++;
        return true;
    }

    save(callback?: () => void) {
        this.callback = callback;
        return this.read()
            .then(() => {
                var lines = [
                    this.metric,
                    `Input file: ${path.basename(this.options.input)}`,
                    `Samples per bin: ${this.samplesPerBin} | Sample Frequency: ${this.options.frequency} | Total Samples: ${this.samples.length}`,
                    `Bin#\tCounts\tSamples`
                ];

                this.aggregates.forEach((val, i) => lines.push(`${i + 1}\t${val.counts}\t${val.sample}`));

                if (this.aggregateCount > 1) {
                    lines.push(`${this.aggregates.length + 1}\t${this.aggregateCount}\t${this.aggregateSampleCount}`);
                }

                var filename = this.getFilename();
                fs.writeFileSync(filename, lines.join('\r\n'));

                console.log(`Saved to ${filename}`);
                return filename;
            });
    }

    getFilename() {
        var measure = this.metric.toLowerCase().replace(' ', '_');
        var filename = `${this.options.output}-${measure}.dat`;
        if (!this.fileExists(filename)) {
            return filename;
        }
        var count = 1;
        while (true) {
            filename = `${this.options.output}-${measure}_${count}.dat`;
            if (!this.fileExists(filename)) {
                return filename;
            }
            count++;
        }
    }

    fileExists(filename: string) {
        try {
            fs.statSync(`${filename}`);
            return true;
        } catch (ex) {
            return false;
        }
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
