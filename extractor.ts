import fs = require('fs');
abstract class Extractor {
	constructor(public options: Options) {
	}
	
	private prev: Sample = null;
	private succ: Sample = null;
	public metric: string = '';

	process(data: Array<Sample>) {
		
	}
	
	save() {
		
	}
}