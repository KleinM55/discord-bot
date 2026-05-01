const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Collection
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

/* ---------------------------
   GLOBAL ERROR HANDLERS
----------------------------*/
process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

/* ---------------------------
   LOAD COMMANDS (RECURSIVE)
----------------------------*/
/ loadCommands(commandsPath);
/* ---------------------------
   REGISTER SLASH COMMANDS
----------------------------*/
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const commands = client.commands.map(cmd => cmd.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log(`Loaded ${commands.length} commands`);
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
});

/* ---------------------------
   INTERACTION HANDLER
----------------------------*/
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Command error (${interaction.commandName}):`, error);

    const reply = {
      content: 'Something went wrong while executing this command.',
      flags: 64
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

/* ---------------------------
   LOGIN
----------------------------*/
client.login(process.env.TOKEN);
