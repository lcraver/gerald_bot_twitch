'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');

let runCommandRegex = new RegExp( /^!(.+)$/ );

// ---- Functions ---- //

module.exports = [
{
	name: 'Plugin Help',
	help: 'Links to bot\'s github.',
    types: ['Chat'],
    regex: runCommandRegex,
    action: function(client, channel, userstate, message, self) {

        let customCommands = pluginSettings["commands"] || {};
        let match = runCommandRegex.exec(message);
        let command = match[1];

        Runtime.logger.Error("Run custom command! " + command);

        if(command in customCommands)
            client.action("limestudios", customCommands[command]);
    }
}]