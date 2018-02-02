'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');
let keywordDB = require('./db/keywords');
let emotionsDB = require('./db/emotions');
let contractionsDB = require('./db/contractions');

// ---- Functions ---- //

module.exports = [{
	name: 'Chat [Join]',
	help: 'Captures messages to gerald and chats with user.',
  types: ['Join'],
  action: function(client, channel, user, self) {
    //client.action("limestudios", String.format("Hello {0}!", user));
    //Runtime.logger.LogObject(user);
		//Runtime.logger.Error("Joined");
  }
},
{
	name: 'Plugin Help',
	help: 'Links to bot\'s github.',
  types: ['Chat'],
  regex: new RegExp(RegExp.escape(Runtime.botAddress) + ".+"),
  action: function(client, channel, userstate, message, self) {

    if(Runtime.debug) {
      Runtime.logger.Error("DEBUG");
      Runtime.clearRequire.all();

      keywordDB = require('./db/keywords');
      emotionsDB = require('./db/emotions');
      contractionsDB = require('./db/contractions');
    }

    message = message.replace(Runtime.botAddress, ""); // Remove bot reference from message

    client.action("limestudios", "Messaged recieved -> [" + message + "]");

    // Find all keywords and emotions

    let messageKeywords = [];
    let currentStart = 0;

    message = cleanInputMessage(message);

    client.action("limestudios", "Cleaned message -> [" + message + "]");

    let messageWords = message.split(' ');
    messageWords.forEach(word => {
      if (word in keywordDB["single"]) 
      {
        for(var i = 0; i < keywordDB["single"][word].length; i++) {
          messageKeywords.push(keywordDB["single"][word][i]);
        }
      }

      for(var multiWord in keywordDB["multi"]) {
        let key = multiWord;
        let val = keywordDB[multiWord];
        let regexStr = "^" + RegExp.escape(key) + "[" + RegExp.escape(".?! ,") + "]";
        let regex = new RegExp(regexStr);

        if(message.substring(currentStart).match(regex))
        {
          for(var i = 0; i < keywordDB["multi"][key].length; i++) {
            messageKeywords.push(keywordDB["multi"][key][i]);
          }
        }
      }
      
      currentStart += 1 + word.length;
    });

    client.action("limestudios", "Keywords -> [" + messageKeywords + "]");
  }
}];

function cleanInputMessage(_message) {

  // Add buffer space
  _message = " " + _message + " "
  
  // Get rid of uppercase
  _message = _message.toLowerCase();

  // TODO: Add fix common spelling mistakes

  // Space out punctuation
  _message = _message.replace("!", " ! ");
  _message = _message.replace("?", " ? ");

  // Get rid of contractions
  for(var contraction in contractionsDB) {
    let key = contraction;
    let val = contractionsDB[contraction];

    _message = _message.replace(key, val);
  }

  return _message;
}