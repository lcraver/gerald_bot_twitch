'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');

// ---- Functions ---- //

/*
"arrhythmia": [
    {
        "kind": "bug",
        "add_time": unixTime,
        "finish_time": unixTime,
        "text": "whatever it says"
    }
]
*/

module.exports = [{
	name: 'Point [Connect]',
	help: 'Captures messages to gerald and chats with user.',
    types: ['Connect'],
    action: function(client) {

        let pointsObj = GetPointDB();
        pointsObj["active"] = [];

        let users = Object.keys(pointsObj["points"]);

        for(let userIndex = 0; userIndex < users.length; userIndex++)
        {
        let user = users[userIndex];
        let tmpPoints = pointsObj["points"][user];
        if(tmpPoints <= pluginSettings.purgePointMin)
            {
            Runtime.logger.Error("Purged: " + user + " ["+tmpPoints+"]");
                delete pointsObj["points"][user];
            }
        }

        SetPointDB(pointsObj);
    }
},
{
	name: '!points',
	help: 'Tells the user their points',
    types: ['Chat'],
    regex: new RegExp(/^!points$/),
    action: function(client, channel, userstate, message, self) {
        /*if(Runtime.helpers.IsOwner(userstate))
        client.action("limestudios", String.format("Bow Down to the owner! {0}", userstate["username"]));
        else if(Runtime.helpers.IsMod(userstate))
        client.action("limestudios", String.format("Bow Down to the mods! {0}", userstate["username"]));
        else*/

        let user = userstate["username"];
        let points = GetPointsForUser(user);

        if(points == 1)
        client.action("limestudios", String.format("@{0} you have {1} point!", user, points));
        else
        client.action("limestudios", String.format("@{0} you have {1} points!", user, points));
    }
},
{
	name: '!points @{user}',
	help: 'Tells another users points',
    types: ['Chat'],
    regex: new RegExp(/^!points\s+@[A-Za-z0-9]+$/),
    action: function(client, channel, userstate, message, self) {
        let user = userstate["username"];
        let userSelected = message.substr(message.indexOf(" @") + 2);
        let points = GetPointsForUser(userSelected);

        if(points == 1)
        client.action("limestudios", String.format("@{0} user {1} has {2} point!", user, userSelected, points));
        else
        client.action("limestudios", String.format("@{0} user {1} has {2} points!", user, userSelected, points));
    }
},
{
	name: '!points @{user} add {amount}',
	help: 'Adds points to another users points',
    types: ['Chat'],
    regex: new RegExp(/^!points\s+@[A-Za-z0-9]+\s+add\s+[-0-9]+$/),
    action: function(client, channel, userstate, message, self) {
        if(Runtime.helpers.IsOwner(userstate))
        {
        let user = userstate["username"];

        let chatParams = Runtime.helpers.GetChatParams(message);

        let userSelected = chatParams["users"][0];
        let userPointAmount = parseInt(chatParams["params"][1]);   

        let pointsObj = GetPointDB();
        
        pointsObj["points"][userSelected.toLowerCase()] = GetPointsForUser(userSelected.toLowerCase()) + userPointAmount;

        SetPointDB(pointsObj);

        if(userPointAmount == 1)
            client.action("limestudios", String.format("@{1} user {0} has given you {2} point! You now have {3} points!", user, userSelected, userPointAmount, GetPointsForUser(userSelected.toLowerCase())));
        else
            client.action("limestudios", String.format("@{1} user {0} has given you {2} points! You now have {3} points!", user, userSelected, userPointAmount, GetPointsForUser(userSelected.toLowerCase())));
        }
    }
},
{
	name: '!todo {project} add {type} {todo}',
	help: 'Adds a new todo to a project',
    types: ['Chat'],
    regex: new RegExp(/^!todo\s+[A-Za-z0-9]+\s+add\s+[A-Za-z0-9]+\s+[A-Za-z0-9]$/),
    action: function(client, channel, userstate, message, self) {
        if(Runtime.helpers.IsOwner(userstate))
        {
        let user = userstate["username"];

        let chatParams = Runtime.helpers.GetChatParams(message);

        let userSelected = chatParams["users"][0];
        let userPointAmount = parseInt(chatParams["params"][1]);   

        let pointsObj = GetPointDB();
        
        pointsObj["points"][userSelected.toLowerCase()] = userPointAmount;

        SetPointDB(pointsObj);

        if(userPointAmount == 1)
            client.action("limestudios", String.format("@{1} user {0} has given you {2} point! You now have {3} points!", user, userSelected, userPointAmount, GetPointsForUser(userSelected.toLowerCase())));
        else
            client.action("limestudios", String.format("@{1} user {0} has given you {2} points! You now have {3} points!", user, userSelected, userPointAmount, GetPointsForUser(userSelected.toLowerCase())));
        }
    }
}];

function GetTodoDB() {
    let todoObj = JSON.parse(Runtime.brain.get("todo"));
  
    if(!todoObj)
    {
        todoObj = {
            "projects": {}
        };

        SetTodoDB(todoObj);
        return todoObj;
    }
  
    return todoObj;
}
  
function SetTodoDB(_new) {
    Runtime.brain.set("todo", JSON.stringify(_new));
}
  