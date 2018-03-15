'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');

let shoutoutsCounter = {};

// ---- Functions ---- //

module.exports = [
{
	name: 'IFTTT [WHISPER]',
	help: 'Captures messages to gerald and chats with user.',
    types: ['Whisper'],
    action: function(client, from, userstate, message, self) {
        //client.action("limestudios", String.format("Hello {0}!", user));
        //Runtime.logger.LogObject(user);
        Runtime.logger.Error(from + " - " + message);
      }
}];