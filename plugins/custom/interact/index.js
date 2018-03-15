'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');

// ---- Functions ---- //

module.exports = [
{
	name: '!interact light {amount}',
	help: 'Adds points to another users points',
  types: ['Chat'],
  regex: new RegExp(/^!interact\s+light+\s+#[A-Za-z0-9]+$/),
  action: function(client, channel, userstate, message, self) {
    if(Runtime.helpers.IsOwner(userstate) || GetPointsForUser(userstate["username"]) >= 5)
    {
      let user = userstate["username"];
      let chatParams = Runtime.helpers.GetChatParams(message);
      let newColor = chatParams["params"][2];   

      var myJSONObject = { 
        "value1": newColor 
      };

      Runtime.request({
        url: 'https://maker.ifttt.com/trigger/twitch_change_light/with/key/'+pluginSettings['ifttt_key'],
        method: "POST",
        json: true,
        body: myJSONObject
      }, function (error, response, body) {
        console.log(response);

        if(!error)
        {
          client.action("limestudios", String.format("{0} has set light to {1}", user, newColor));

          let pointsObj = GetPointDB();
          pointsObj["points"][user.toLowerCase()] = GetPointsForUser(user.toLowerCase()) - 5;
          SetPointDB(pointsObj);
        }
        else
        {
          client.action("limestudios", String.format("Sadly there was an error trying to set the light to {1}! @{0}", user, newColor));
        }
      });
    }
    else
    {
      let user = userstate["username"];
      let chatParams = Runtime.helpers.GetChatParams(message);
      let newColor = chatParams["params"][2];   
      client.action("limestudios", String.format("Sadly @{0} you don't have the required 5 points!", user, newColor));
    }
  }
}];

function GetPointsForUser(_user) {
  let pointsObj = JSON.parse(Runtime.brain.get("points"));
  if(_user in pointsObj["points"])
    return parseInt(pointsObj["points"][_user.toLowerCase()]);
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
