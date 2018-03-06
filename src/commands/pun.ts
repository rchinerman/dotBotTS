const jokes = require('../../resources/jokes.json');

import { Message, Client } from 'discord.js';

module.exports.run = async (bot: Client, message: Message, args: Array<string>) => {
  try {
    let randomIndex: number = Math.floor(Math.random() * jokes.length);
    message.channel.send(jokes[randomIndex]);
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.help = {
  name: 'pun',
  usage: '.pun',
  about: 'Prints out a short joke.'
};
