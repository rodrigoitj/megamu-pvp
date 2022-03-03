require("dotenv").config();
const tmi = require("tmi.js");
const channels = require("./streamers");
const credentials = require("./credentials");
const pvp = require("./pvp");

// https://dev.twitch.tv/docs/irc#privmsg-twitch-tags

const [, , user] = process.argv;
const opts = {
  identity: credentials[user],
  channels: channels[user],
};

const client = new tmi.client(opts);
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.connect();

function getPhrase(arg, username) {
  if (pvp.hasOwnProperty(arg.toUpperCase())) {
    return pvp[arg.toUpperCase()].replace("@vc", `@${username}`);
  } else {
    return `@${username} eu não conheço a classe "${arg}"`;
  }
}

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot
  var username = context["username"];
  const [commandName, arg1] = msg.trim().split(" ");
  console.log(msg);
  if (commandName === "!pvp") {
    var phrase = getPhrase(arg1, username);
    if (phrase) {
      client.say(target, `${phrase}`);
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  //console.log(`* Connected to ${addr}:${port}`, user, channels[user]);
  client.say(
    `${user}`,
    `Hello! I'm a bot that will help you with the PVP phrases.`
  );
}
