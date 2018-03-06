import discord = require('discord.js');
import fetch from 'node-fetch';

const config = require('../config');
const champIds = require('../../resources/id_info_dict.json');
const champKeys = require('../../resources/key_info_dict.json');
const champRoles = require('../../resources/champ_roles.json');
const CHAMPGG_KEY = config.league.championgg;

import { Message, Client, RichEmbed } from 'discord.js';

module.exports.run = async (bot: Client, message: Message, args: Array<string>) => {
  const findKey = (object: {string: {id: number, title: string, name: string}}, key: string) => {
    return Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase());
  };
  if (args.length === 0) {
    message.channel.send("Please supply a champion name after the '.champ' command.");
    return;
  }
  try {
    const championEntered: string = args.join(' ').replace(/[^A-Za-z]/g, '');
    const url: string = 'http://api.champion.gg/v2/champions/';
    const championKey: string = <string> findKey(champKeys, championEntered);
    const championId: number = champKeys[championKey].id;
    const imgUrl: string = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/';

    let champData: any = await fetch(`${url}${championId}?&api_key=${CHAMPGG_KEY}`);
    champData = await champData.json();
    const embed: RichEmbed = new discord.RichEmbed()
      .setDescription(`${champIds[championId].title}`)
      .setAuthor(`${champIds[championId].name}`)
      .setThumbnail(`${imgUrl}${champIds[championId].key}.png`)
      .setColor(523423)
      .setFooter(`Stats from Champion.gg | Patch ${champData[0].patch} | Platinum+`);
    champData.forEach((role: any, i: number) => {
      if ( i > 0 ) { embed.addBlankField(); }
      embed.addField('Role', `${champRoles[role.role]}`, true)
           .addField('Win Rate', `${(role.winRate * 100).toFixed(2)}%`, true)
           .addField('Play Rate', `${(role.playRate * 100).toFixed(2)}%`, true)
           .addField('Ban Rate', `${(role.banRate * 100).toFixed(2)}%`, true)
           .addField('Games Played', `${role.gamesPlayed}`, true)
           .addField('Role Popularity', `${(role.percentRolePlayed * 100).toFixed(2)}%`, true);
      });

    message.channel.send({embed: embed});
    } catch (err) {
      message.channel.send('Champion not found, please try again.');
      console.log(err.stack);
  }
};

module.exports.help = {
  name: 'champ',
  usage: '.champ <name>',
  about: 'Prints out stats for specified champion from Champion.gg.'
};
