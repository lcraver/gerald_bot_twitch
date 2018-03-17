'use strict';

const Runtime = require('../../../utils/Runtime');
const pluginSettings = require('./settings');
const path = require("path");

// ---- Functions ---- //

module.exports = [{
	name: 'Point [Connect]',
	help: 'Captures messages to gerald and chats with user.',
    types: ['Connect'],
    action: function(client) {
        
        if(JSONPixelGrid() == null)
        {
            let pixels = [];
            for(let i = 0; i < 100; i++)
                pixels.push("#fff");
            Runtime.brain.set("pixel_grid", JSON.stringify(pixels));
        }

        Runtime.app.use('/drawing', Runtime.express.static(path.join(__dirname, 'web')));
        Runtime.app.get('/drawing/data', function (req, res) {
            res.send(JSONPixelGrid());
        });
    }
},
{
	name: '!interact draw x y #{color}',
	help: 'Adds points to another users points',
    types: ['Chat'],
    regex: new RegExp(/^!interact\s+draw+\s+[0-9]+\s+[0-9]+\s+#[A-Za-z0-9]+$/),
    action: function(client, channel, userstate, message, self) {
        if(Runtime.helpers.IsOwner(userstate) || GetPointsForUser(userstate["username"]) >= 5)
        {
            let user = userstate["username"];
            let chatParams = Runtime.helpers.GetChatParams(message);
            console.log(chatParams["params"]);

            let x = parseInt(chatParams["params"][2]);   
            let y = parseInt(chatParams["params"][3]);   
            let newColor = chatParams["params"][4];   

            if(y >= 0 && y <= 9 && x >= 0 && x <= 9)
            {
                let gridTmp = JSONPixelGrid();            
                gridTmp[y*10+x] = newColor;
                Runtime.brain.set("pixel_grid", JSON.stringify(gridTmp));

                SetUserPoint(user, GetPointsForUser(user) - 5);
                client.action("limestudios", String.format("{0} has set pixel [{1}, {2}] to {3}", user, x, y, newColor));
            }
            else
            {
                let user = userstate["username"];
                let chatParams = Runtime.helpers.GetChatParams(message);
                let x = parseInt(chatParams["params"][2]);   
                let y = parseInt(chatParams["params"][3]);   
                let newColor = chatParams["params"][4];   
                client.action("limestudios", String.format("Sadly @{0} your coordinates [{1}, {2}] were out of bounds!", user, x, y));
            }
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

function JSONPixelGrid() {
    return JSON.parse(Runtime.brain.get("pixel_grid"));
}

function GetPointsForUser(_user) {
    _user = _user.toLowerCase();
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
        "points": {},
        "active": []
        };

        Runtime.brain.set("points", JSON.stringify(pointsObj));
    }

    return pointsObj;
}

function SetPointDB(_new) {
    Runtime.brain.set("points", JSON.stringify(_new));
}
  
function SetUserPoint(_user, _new) {
    _user = _user.toLowerCase();
    let pointsObj = GetPointDB();
    pointsObj["points"][_user] = _new;
    SetPointDB(pointsObj);
}