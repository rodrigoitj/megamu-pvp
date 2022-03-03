require("dotenv").config();
const tmi = require("tmi.js");
const channels = require("./streamers");
const credentials = require("./credentials");
const pvp = require("./pvp");

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
  arg = (arg || "").toUpperCase();
  if (pvp.hasOwnProperty(arg)) {
    return pvp[arg].replace("@vc", `@${username}`);
  } else {
    return `@${username} eu não conheço a classe "${arg}". digite !pvp comandos para todos os comandos.`;
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
  console.log(`* Connected to ${addr}:${port}`, user, channels[user]);
}
