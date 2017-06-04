'use strict';

const brain = require('node-persist');

class Brain {
	static start(directory) {
		brain.initSync({
			dir: directory
		});
	}

	static get(key) {
		return brain.getItemSync(key) || null;
	}

	static set(key, value) {
		brain.setItemSync(key, value);
	}

	static getValuesWithKey(key) {
		return brain.valuesWithKeyMatch(key);
	}

	static remove(key) {
		brain.removeItemSync(key);
	}
};

module.exports = Brain;
