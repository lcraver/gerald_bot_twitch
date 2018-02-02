'use strict';

const Runtime = require('./Runtime');

class Helpers {

	static IsMod(_mod) {
		return _mod["user-type"] == "mod";
	}

  static IsOwner(_owner) {
    return _owner["username"] == Runtime.credentials.channels[0];
	}

	static GetChatParams(_message) {

		let params = _message.split(" ");
		let users = params.filter(function(word){
			return word[0] == "@";
		});
		users.forEach(function(part, index, users) {
			users[index] = part.substr(1, part.length);
		});
		params = params.filter(function(word){
			return word[0] != "@";
		});

		return {
			"full": _message,
			"params": params,
			"users": users
		}
	}
}

module.exports = Helpers;
