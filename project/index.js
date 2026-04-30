const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, REST, Routes, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// 🔹 function to read commands (including subfolders)
function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      loadCommands(fullPath); // recursion for subfolders
    } else if (file.endsWith('.js')) {
      const command = require(fullPath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      }
    }
  }
}

// 🔹 load all commands
loadCommands(path.join(__dirname, 'commands'));

// 🔹 register commands
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
    console.error(error);
  }
});

// 🔹 handle interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Error executing command', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Error executing command', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
