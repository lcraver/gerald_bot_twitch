'use strict';

const Credentials = require('./settings/credentials');
const Settings = require('./settings/settings');
const Brain = require('./utils/Brain');
const Logger = require('./utils/Logger');
const Loader = require('./utils/Loader');
const Helpers = require('./utils/Helpers');
const ChatBot = require('./utils/ChatBot');
const TMI = require('tmi.js');
const clearRequire = require('clear-require');
var request = require('request');
var express = require('express');
const app = express()
app.listen(Settings["app_port"], () => console.log('Example app listening on port '+Settings["app_port"]+'!'))
require('./utils/Prototypes');

// Build the initial runtime object
let Runtime = require('./utils/Runtime');
Runtime.debug = Settings["debug"];
Runtime.credentials = Credentials;
Runtime.settings = Settings;
Runtime.brain = Brain;
Runtime.logger = Logger;
Runtime.loader = Loader;
Runtime.helpers = Helpers;
Runtime.tmi = TMI;
Runtime.request = request;
Runtime.express = express;
Runtime.app = app;
Runtime.clearRequire = clearRequire;
Runtime.botAddress = "@" + Runtime.credentials.identity.username + " ";

// Verify credentials exist
if (!Runtime.credentials.identity || !Runtime.credentials.identity.username || !Runtime.credentials.identity.password || !Runtime.credentials.channels) {
	Runtime.logger.Error('Credentials file is missing required attributes. Please check your credentials.js');
	Runtime.logger.Error('[BOT] Quitting startup process.');
	return;
}

Runtime.brain.start( __dirname + "/brain" );
ChatBot.start();
