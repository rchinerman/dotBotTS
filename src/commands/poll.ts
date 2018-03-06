const emojis = require('../../resources/emoji.json');

import { Message, Client } from 'discord.js';

module.exports.run = async (bot: Client, message: Message, args: Array<string>) => {
  try {
    let text = <RegExpMatchArray> message.content.match(/\([^(]+\)/g);

    if (text === null) {
      message.channel.send('Please ensure the question and each option are surrounded by ' +
      'parentheses: \( and \)');
      return;
    }

    let validForms = true;

    text.forEach((entry) => {
      if (!(entry.startsWith('\(')) || !(entry.endsWith('\)'))) {
        validForms = false;
        return;
      }
    });

    if (!validForms) {
      message.channel.send('Please ensure the question and each option are surrounded by ' +
      'parentheses: \( and \)');
      return;
    }

    let noQuotes = text.map((entry) => {
      entry = entry.replace(/\(/g, '');
      return entry.replace(/\)/g, '');
    });

    let questions = noQuotes.slice(1).map((entry, i) => {
      let letter = String.fromCharCode(65 + i);
      return {'name': emojis[letter] + ' ' + entry, 'value': '\u200B', inline: true};
    });
    if (questions.length < 2) {
      message.channel.send('Please give at least two options.');
      return;
    }
    if (questions.length > 9) {
      message.channel.send('Please give no more than 9 options.');
      return;
    }
    const msg: Message = await message.channel.send({embed: {
      color: 3447003,
      title: noQuotes[0],
      description: 'Asked by ' + message.author.toString(),
      fields: questions
    }}) as Message;

    questions.forEach((question, i: number) => {setTimeout(
      () => {
          const letter = String.fromCharCode(65 + i);
          msg.react(emojis[letter]);
      },
      i * 500);
    });

  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.help = {
  name: 'poll',
  usage: '.poll \(Question\) \(Option 1\) \(Option 2\)',
  about: 'Creates a poll with up to nine options.'
};
