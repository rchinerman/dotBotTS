import discord = require('discord.js');
import fs = require('fs');

import { Message, Client } from 'discord.js';

module.exports.run = async (bot: Client, message: Message, args: Array<string>) => {
  try {
    fs.readdir('./commands', (err: Error, files: Array<string>) => {
      const commandTitles = files.filter(f => f.split('.').pop() === 'js');
      let commandInfo: Array<{ name: string, value: string}> = commandTitles.map((title: string) => {
        const command = require(`./${title}`);
        return({'name': `${command.help.usage}`, 'value': `${command.help.about}`});
      });
      message.channel.send({embed: {
        color: 3447003,
        title: 'Commands',
        description: '\u200B',
        fields: commandInfo
      }});

    });
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.help = {
  name: 'help',
  usage: '.help',
  about: 'Prints out a short message describing each command.'
}