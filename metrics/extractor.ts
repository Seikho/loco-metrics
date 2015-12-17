import fs = require('fs');
abstract class Extractor {
	constructor(public options: Options) {
	}
	
	private prev: Sample = null;
	private succ: Sample = null;
	public metric: string = '';

	process(data: Array<Sample>) {
		data.forEach(datum => {
			this.prev = this.succ;
			this.succ = datum;
			this.parse(datum);
		});
	}
	
	save() {
		
	}

	abstract parse(sample: Sample): void;
}
