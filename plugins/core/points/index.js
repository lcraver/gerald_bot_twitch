'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');

// ---- Functions ---- //

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
	name: 'Point [Recurring]',
	help: 'Captures messages to gerald and chats with user.',
  types: ['Recurring'],
  action: function(client) {

    let pointsObj = GetPointDB();

    for(var i in pointsObj["active"])
    {
      if(!pointsObj["points"][pointsObj["active"][i]])
        pointsObj["points"][pointsObj["active"][i]] = 1;
      else
        pointsObj["points"][pointsObj["active"][i]] += 1;
      Runtime.logger.Error("Point added to: " + pointsObj["active"][i]);
    }

    SetPointDB(pointsObj);
  }
},
{
	name: 'Points [Join]',
	help: 'Captures messages to gerald and chats with user.',
  types: ['Join'],
  action: function(client, channel, user, self) {

    let pointsObj = GetPointDB();

    for(var i in pointsObj["active"])
      if(user == pointsObj["active"][i])
        return;

    pointsObj["active"].push(user);
    Runtime.logger.Error("Added: " + user);

    SetPointDB(pointsObj);
  }
},
{
	name: 'Points [Part]',
	help: 'Captures messages to gerald and chats with user.',
  types: ['Part'],
  action: function(client, channel, user, self) {
    Runtime.logger.Error("PARTING");

    /*if(!Runtime.brain.get("active-users"))
      Runtime.brain.set("active-users", "[]");

    let activeUsersOld = Runtime.brain.get("active-users");
    let activeUsers = [];

    for(var i in activeUsersOld)
      activeUsers.push(activeUsersOld[i]);

    if(activeUsers.includes(user))
    {
      activeUsers.splice(activeUsers.indexOf(user), 1);
      Runtime.brain.set("active-users", activeUsers);
    }*/
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
	name: '!points @{user} set {amount}',
	help: 'Adds points to another users points',
  types: ['Chat'],
  regex: new RegExp(/^!points\s+@[A-Za-z0-9]+\s+set\s+[-0-9]+$/),
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

function GetPointsForUser(_user) {
  let pointsObj = JSON.parse(Runtime.brain.get("points"));
  if(_user in pointsObj["points"])
    return parseInt(pointsObj["points"][_user]);
  else 
    return 0;
}

function GetPointDB() {
  let pointsObj = JSON.parse(Runtime.brain.get("points"));

  if(!pointsObj)
  {
    pointsObj = {
      "points": [],
      "active": []
    };

    Runtime.brain.set("points", JSON.stringify(pointsObj));
  }

  return pointsObj;
}

function SetPointDB(_new) {
  Runtime.brain.set("points", JSON.stringify(_new));
}
