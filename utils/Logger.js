'use strict';

const Runtime = require('./Runtime');

class Logger {

	static Debug(_debug) {
		if(Runtime.debug)
			console.log(_debug);
	}

	static LogObject(_debug)
	{
		console.log(JSON.stringify(_debug));
	}

	static Log(_debug) {
		console.log(_debug);
	}

	static Warning(_warning) {
		console.log('\x1b[33m%s\x1b[0m', _warning);
	}

	static Error(_error) {
		console.log('\x1b[31m\x1b[47m %s \x1b[0m', _error);
	}

}

module.exports = Logger;
