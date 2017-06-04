'use strict';

const Runtime = require('./Runtime');

class Helpers {

	static IsMod(_mod) {
		return _mod["user-type"] == "mod";
	}

  static IsOwner(_owner) {
    return _owner["username"] == Runtime.credentials.channels[0];
	}
}

module.exports = Helpers;
