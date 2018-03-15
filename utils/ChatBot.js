'use strict';

const Runtime = require('./Runtime');

class ChatBot {
	static start() {
		Runtime.logger.Debug("[DEBUG MODE]");

		Runtime.loader.loadCorePlugins((pluginCommands) => {
			Runtime.loadedCommands = pluginCommands;
			Runtime.logger.LogObject(Runtime.loadedPlugins);
			Runtime.logger.LogObject(Runtime.loadedCommands);
		});

		// might want to fix later
		let creds = JSON.parse(JSON.stringify(Runtime.credentials))
		var client = new Runtime.tmi.client(creds);
		client.connect().then(function(data) { // Connected
			ChatBot.runStartupPluginCommands(client);
			ChatBot.runJoinPluginCommands(client);
			ChatBot.runPartPluginCommands(client);
			ChatBot.runChatPluginCommands(client);
			ChatBot.runWhisperPluginCommands(client);
			ChatBot.runRecurringPluginCommands(client);

			ChatBot.runHostedPluginCommands(client);
			ChatBot.runCheerPluginCommands(client);
			ChatBot.runSubPluginCommands(client);
			ChatBot.runReSubPluginCommands(client);
		}).catch(function(err) {
			Runtime.logger.Error(err);
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
				if(command.regex == null || command.regex.exec(message))
				{
					Runtime.logger.Warning("[Running Chat Command] -> " + command.name);
					command.action(client, channel, userstate, message, self);
				}
			});
		});
	}

	static runWhisperPluginCommands(client) {
		client.on("whisper", function(from, userstate, message, self) {
			if(self)
			{
				Runtime.logger.Warning("Gerald whispered it so Ignore ["+message+"].");
				return;
			}
			Runtime.loadedCommands.Whisper.forEach(function(command) {
				if(command.regex == null || command.regex.exec(message))
				{
					Runtime.logger.Warning("[Running Whisper Command] -> " + command.name);
					command.action(client, from, userstate, message, self);
				}
			});
		});
	}

	static runRecurringPluginCommands(client) {
		
			Runtime.loadedCommands.Recurring.forEach(function(command) {

				if(command.config == undefined)
					command.config = 60000

				setInterval(function(){
					//Runtime.logger.Warning("[Running Recurring Command] -> " + command.name + " every " + command.config);
					command.action(client);
				}, command.config);
			});
	}


	static runHostedPluginCommands(client) {
		client.on("hosted", function(channel, username, viewers, autohost) {
			Runtime.loadedCommands.Hosted.forEach(function(command) {
				Runtime.logger.Warning("[Running Hosted Command] -> " + command.name);
				command.action(client, channel, username, viewers, autohost);
			});
		});
	}

	static runCheerPluginCommands(client) {
		client.on("cheer", function(channel, userstate, message) {
			Runtime.loadedCommands.Cheer.forEach(function(command) {
				Runtime.logger.Warning("[Running Cheer Command] -> " + command.name);
				command.action(client, channel, userstate, userstate.bits, message);
			});
		});
	}

	static runSubPluginCommands(client) {
		client.on("subscription", function (channel, username, method, message, userstate) {
			Runtime.loadedCommands.Sub.forEach(function(command) {
				Runtime.logger.Warning("[Running Sub Command] -> " + command.name);
				command.action(client, channel, username, method, message, userstate);
			});
		});
	}

	static runReSubPluginCommands(client) {
		client.on("resub", function (channel, username, months, message, userstate, methods) {
			Runtime.loadedCommands.ReSub.forEach(function(command) {
				Runtime.logger.Warning("[Running ReSub Command] -> " + command.name);
				command.action(client, channel, username, months, message, userstate, methods);
			});
		});
	}
}

module.exports = ChatBot;
