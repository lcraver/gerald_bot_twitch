'use strict';

const Runtime = require('./Runtime');

class ChatBot {
	static start() {
		Runtime.logger.Debug("[DEBUG MODE]");

		Runtime.loader.loadCorePlugins((pluginCommands) => {
			Runtime.loadedCommands = pluginCommands;
			Runtime.logger.LogObject(Runtime.loadedPlugins);

			// might want to fix later
			let creds = JSON.parse(JSON.stringify(Runtime.credentials))
			var client = new Runtime.tmi.client(creds);
			client.connect().then(function(data) { // Connected
			    ChatBot.runStartupPluginCommands(client);
					ChatBot.runJoinPluginCommands(client);
					ChatBot.runPartPluginCommands(client);
					ChatBot.runChatPluginCommands(client);
					ChatBot.runRecurringPluginCommands(client);
			}).catch(function(err) {
			    Runtime.logger.Error(err);
			});
		});
	}

	static runStartupPluginCommands(client) {
		Runtime.loadedCommands.Connect.forEach(function(command) {
			Runtime.logger.Warning("[Running Startup Command] -> " + command.name);
			command.action(client);
		});
	}

	static runJoinPluginCommands(client) {
		client.on("join", function(channel, user, self) {
			if(self)
			{
				Runtime.logger.Warning("Gerald joined so ignore.");
				return;
			}
			Runtime.loadedCommands.Join.forEach(function(command) {
				Runtime.logger.Warning("[Running Join Command] -> " + command.name);
				command.action(client, channel, user, self);
			});
		});
	}

	static runPartPluginCommands(client) {
		client.on("part", function(channel, user, self) {
			if(self)
			{
				Runtime.logger.Warning("Gerald left so ignore.");
				return;
			}
			Runtime.loadedCommands.Part.forEach(function(command) {
				Runtime.logger.Warning("[Running Part Command] -> " + command.name);
				command.action(client, channel, user, self);
			});
		});
	}

	static runChatPluginCommands(client) {
		client.on("chat", function(channel, userstate, message, self) {
			if(self)
			{
				Runtime.logger.Warning("Gerald said it so Ignore ["+message+"].");
				return;
			}
			Runtime.loadedCommands.Chat.forEach(function(command) {
				if(command.regex.exec(message))
				{
					Runtime.logger.Warning("[Running Chat Command] -> " + command.name);
					command.action(client, channel, userstate, message, self);
				}
			});
		});
	}

	static runRecurringPluginCommands(client) {
		setInterval(function(){
			Runtime.loadedCommands.Recurring.forEach(function(command) {
				Runtime.logger.Warning("[Running Recurring Command] -> " + command.name);
				command.action(client);
			});
		}, 60000);
	}
}

module.exports = ChatBot;
