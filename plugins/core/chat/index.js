'use strict';

const Runtime = require('../../../utils/Runtime');

// ---- Functions ---- //

module.exports = [{
	name: 'Chat [Connect]',
	help: 'Captures messages to gerald and chats with user.',
  types: ['Connect'],
  action: function(client) {
    //client.action("limestudios", "Hello everyone Gerald is here!");
		//Runtime.logger.Error("Connected");
  }
},
{
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
	name: 'Chat [Part]',
	help: 'Captures messages to gerald and chats with user.',
  types: ['Part'],
  action: function(client, channel, user, self) {
    //client.action("limestudios", String.format("Bye {0}!", user));
		//Runtime.logger.Error("Parted");
  }
},
{
	name: 'Chat [Chat]',
	help: 'Captures messages to gerald and chats with user.',
  types: ['Chat'],
  regex: new RegExp(RegExp.escape("test")),
  action: function(client, channel, userstate, message, self) {
    client.action("limestudios", "Hello!");
		Runtime.logger.Error("Chat");
  }
}];
