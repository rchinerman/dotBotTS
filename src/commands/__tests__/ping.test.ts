const ping = require('./ping');

describe('ping', () => {
  let createMessage;
  beforeEach(() => {
    createMessage = (props: any) => ({
      author: {
        bot: false
      },
      channel: {
        send: jest.fn()
      },
      guild: {
        id: 12345,
        name: 'Unit Test Server'
      },
      content: '',
      embeds: [],
      ...props
    });
  });

  it('responds to a regular WCL link', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE');
      });
  });
});


import { CommandoClient } from 'discord.js-commando';
import { Server } from './Server/Server';

import * as path from 'path';

export class Bot {
  private client: CommandoClient;
  private server: Server;

  public start(token: string): void {
    console.log('Starting bot...');
    this.client = new CommandoClient({
      owner: '95613128812802048',
      commandPrefix: '.',
      messageCacheLifetime: 30,
      messageSweepInterval: 60
    });

    this.client.on("ready", () => {
      console.log("The bot is ready!");
      console.log("Starting server...");
      this.server = new Server(4300, this.client);
      this.client.user.setGame("Use >help");
    });

    this.client.registry
      .registerGroups([
        ["nsfw", "Nsfw"],
        ["util", "Util"],
        ["gifs", "Gifs"],
        ["levels", "Levels"]
      ])
      .registerDefaults()
      .registerCommandsIn(path.join(__dirname, "Commands"));

    this.client
      .setProvider(
        mongoose
          .connect(mongoDb)
          .then(() => new MongoProvider(mongoose.connection))
      )
      .catch(console.error);

    Levels.setupListeners(this.client);

    this.client.login(token);
  }
}
