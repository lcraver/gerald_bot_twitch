'use strict';

const fs = require('fs');
const path = require('path');
const Runtime = require('./Runtime');
const commandTypes = [
	'Connect', // BOT Connected to Channel
	'Join', // User Joined Channel
	'Part', // User Left Channel
	'Chat', // Message in Chat
	'Whisper', // Private Message
	'Recurring', // Runs once a minute

	'Hosted', // Channel was hosted
	'Cheer', // Someone cheered
	'Sub', // Someone subbed
	'ReSub' // Someone resubbed
];

class Loader {

	static loadCorePlugins(callback) {

		// Make sure each command type is an array
		let pluginCommands = {};
		commandTypes.forEach((commandType) => {
			pluginCommands[commandType] = [];
		});

		// Get Plugin Directory
		const pluginsDir = path.join( __dirname, '..', 'plugins');

		// Load Core
		let coreDir = path.join(pluginsDir, "core");

		fs.readdir(coreDir, function(err, folders) {
			if (err)
      		{
				Runtime.logger.Warning('No [./plugins/core] directory exists.');
				callback(pluginCommands);
				return;
			}

			folders.forEach((pluginName) => {
				Runtime.logger.Warning("[Loading Core Plugin] -> " + pluginName);
				let coreIndexFile = path.join(coreDir, pluginName, 'index.js');
				let coreSettingsFile = path.join(coreDir, pluginName, 'settings.json');
				let commands = require(coreIndexFile);
				let settings = null;
				try {
					settings = require(coreSettingsFile);
				}
				catch(e) {
					Runtime.logger.Warning("Plugin ["+pluginName+"] doesn't have a settings.json file.");
				}

				// Add to plugin list
				let pluginTmp = {
					name: pluginName,
					description: "No description."
				};
				if(settings != null)
					pluginTmp.description = settings.description;
				Runtime.loadedPlugins.push(pluginTmp);

				commands.forEach((command) => {
					Runtime.logger.Warning("[Loading Core Plugin] -> " + pluginName + " -> " + command.name);
					Loader.parseCommandIntoMessageTypes(command, pluginCommands);
				});
			});

			callback(pluginCommands);
		});

		// Load Custom
		let customDir = path.join(pluginsDir, "custom");

		fs.readdir(customDir, function(err, folders) {
			if (err)
      		{
				Runtime.logger.Warning('No [./plugins/custom] directory exists.');
				callback(pluginCommands);
				return;
			}

			folders.forEach((pluginName) => {
				Runtime.logger.Warning("[Loading Custom Plugin] -> " + pluginName);
				let customIndexFile = path.join(customDir, pluginName, 'index.js');
				let customSettingsFile = path.join(customDir, pluginName, 'settings.json');
				let commands = require(customIndexFile);
				let settings = null;
				try {
					settings = require(customSettingsFile);
				}
				catch(e) {
					Runtime.logger.Warning("Plugin ["+pluginName+"] doesn't have a settings.json file.");
				}

				// Add to plugin list
				let pluginTmp = {
					name: pluginName,
					description: "No description."
				};
				if(settings != null)
					pluginTmp.description = settings.description;
				Runtime.loadedPlugins.push(pluginTmp);

				commands.forEach((command) => {
					Runtime.logger.Warning("[Loading Custom Plugin] -> " + pluginName + " -> " + command.name);
					Loader.parseCommandIntoMessageTypes(command, pluginCommands);
				});
			});

			callback(pluginCommands);
		});
	}

	static parseCommandIntoMessageTypes(command, commandObject) {
		// Loop through each command so we can separate out
		// each command type to its own array.
		commandTypes.forEach((commandType) => {
			if (command.types.indexOf(commandType) >= 0) {
				commandObject[commandType].push(command);
			}
		});
	}
}

module.exports = Loader;
