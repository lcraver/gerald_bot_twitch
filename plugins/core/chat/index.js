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
	help: 'Test command to see if gerald is on.',
  types: ['Chat'],
  regex: new RegExp(RegExp.escape(Runtime.botAddress + "test")),
  action: function(client, channel, userstate, message, self) {
    client.action("limestudios", "Hello!");
		Runtime.logger.Error("Chat");
  }
},
{
	name: 'Chat Help',
	help: 'Tells you all the help documentation for the Bot\'s chat.',
  types: ['Chat'],
  regex: new RegExp(RegExp.escape(Runtime.botAddress + "chat help")),
  action: function(client, channel, userstate, message, self) {

    displayCommandHelp(client);
  }
},
{
	name: 'Plugin Help',
	help: 'Tells you all the help documentation for the Bot\'s chat.',
  types: ['Chat'],
  regex: new RegExp(RegExp.escape(Runtime.botAddress + "plugin help")),
  action: function(client, channel, userstate, message, self) {

    displayPluginHelp(client);
  }
}];


function displayCommandHelp(client) {
  Runtime.loadedCommands["Chat"].forEach(function(element) {
    client.action("limestudios", element.name + " : " + element.regex + " -> " + element.help);
  }, this);
}

function displayPluginHelp(client) {
  Runtime.loadedPlugins.forEach(function(element) {
    client.action("limestudios", element.name + " -> " + element.description);
  }, this);
}