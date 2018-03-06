import discord = require('discord.js');
import fetch from 'node-fetch';

const config = require('../config');
const icons = require('../../resources/weather_icons.json');
const WEATHER_KEY: string = config.weather.dark_sky_api;
const MAPS_API: string  = config.weather.google_maps_api;

import { Message, Client } from 'discord.js';

module.exports.run = async (bot: Client, message: Message, args: Array<string>) => {
  try {
    const address = args.join(' ');
    const mapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    const weatherUrl = 'https://api.darksky.net/forecast/';

    let mapData: any = await fetch(`${mapsUrl}${address}&key=${MAPS_API}`);
    mapData = await mapData.json();
    const coords = mapData.results[0].geometry.location;
    const location = mapData.results[0].formatted_address;

    let weatherData: any = await fetch(`${weatherUrl}${WEATHER_KEY}/${coords.lat},${coords.lng}`);
    weatherData = await weatherData.json();
    const current = weatherData.currently;
    const summary = weatherData.minutely.summary;
    const forecast = weatherData.daily.summary;

    const embed = new discord.RichEmbed()
      .setDescription(`**${summary}**`)
      .setAuthor(`Weather for ${location}`)
      .setThumbnail(`${icons[current.icon]}`)
      .setColor(523423)
      .addField('Temperature', `${current.temperature}\u00B0F`, true)
      .addField('Feels Like', `${current.apparentTemperature}\u00B0F`, true)
      .addField('Winds', `${current.windSpeed}mph`, true)
      .addField('Humidity', `${current.humidity}%`, true)
      .addField('Chance of Rain', `${current.precipProbability}%`, true)
      .addField('Forecast', `${forecast}`);

    message.channel.send({embed: embed});
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.help = {
  name: 'weather',
  usage: '.weather <address or city>',
  about: 'Prints out weather forecast for specified location.'
};
