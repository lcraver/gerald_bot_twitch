'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');

let shoutoutsCounter = {};

// ---- Functions ---- //

module.exports = [{
	name: 'Point [Connect]',
	help: 'Captures messages to gerald and chats with user.',
    types: ['Connect'],
    action: function(client) {
        shoutoutsCounter = {};
        pluginSettings["shoutouts"].forEach(function(element) {
            shoutoutsCounter[element["text"]] = {
                "timeCounter": 0,
                "textCounter": 0
            };
        }, this);

        Runtime.logger.Warning(JSON.stringify(shoutoutsCounter));
    }
},
{
	name: 'Point [Recurring]',
	help: 'Captures messages to gerald and chats with user.',
    types: ['Recurring'],
    config: 60000,
    action: function(client) {
        pluginSettings["shoutouts"].forEach(function(element) {
            shoutoutsCounter[element["text"]]["timeCounter"] += 1;
        }, this);

        for (let key in shoutoutsCounter) {

            let time = 100;
            let text = [];

            pluginSettings["shoutouts"].forEach(function(element) {
                if(element["text"] == key)
                {
                    time = element["time"];
                    text = element["text"];
                }
            }, this);

            if(shoutoutsCounter[key]["timeCounter"] > time) {
                client.action("limestudios", text[shoutoutsCounter[key]["textCounter"]]);
                shoutoutsCounter[key]["timeCounter"] = 0;
                shoutoutsCounter[key]["textCounter"] += 1;
                if(shoutoutsCounter[key]["textCounter"] >= text.length)
                    shoutoutsCounter[key]["textCounter"] = 0;
            }
        }
    }
}];