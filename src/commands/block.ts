const emojis = require("../../resources/emoji.json");

import { Message, Client } from 'discord.js';

module.exports.run = async (bot: Client, message: Message, args: Array<string>) => {
  try {
    let reply = '';
    let content = '';
    args.forEach((word) => {
      content += word + ' ';
    });
    content.split('').forEach((letter) => {
      let code = letter.charCodeAt(0);
      if ((code > 47 && code < 58) || // numeric (0-9)
          (code > 64 && code < 91) || // upper alpha (A-Z)
          (code === 63) || // ?
          (code === 33) || // !
          (code > 96 && code < 123) || // lower alpha (a-z)
          (code === 32)) { // space
            reply += emojis[letter.toUpperCase()] + ' ';
      }
    });
    if (reply.length > 0) {
      message.channel.send(`${reply}`);
    }
    else {
      message.channel.send("No valid characters entered. Please enter only letters, numbers, '!' and '?'.");
    }
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.help = {
  name: 'block',
  usage: '.block <text>',
  about: 'Enter a combination of numbers and letters and have it emojified.'
};
