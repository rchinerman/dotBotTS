const discord = require("discord.js");
const config = require("./config");
const fs = require("fs");

const prefix = config.prefix;

import { Message } from "discord.js";

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands", (err: Error, files: Array<string>) => {
  if(err) console.error(err);

  let jsfiles = files.filter(f => f.split(".").pop() === "js");

  if(jsfiles.length <= 0){
    console.log("No commands to load.");
    return;
  }

  console.log(`Loading ${jsfiles.length} commands.`);

  jsfiles.forEach((f: string) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded.`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  bot.user.setActivity(".help");
  console.log("I am ready!");
});

bot.on("message", async (message: Message) => {
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  let cmd = bot.commands.get(command.slice(prefix.length));
  if(cmd) cmd.run(bot, message, args);
});

bot.login(config.client.token);