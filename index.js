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

/* ---------------- SAFE ERROR HANDLING ---------------- */
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

/* ---------------- LOAD COMMANDS ---------------- */
function loadCommands(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        loadCommands(fullPath);
      } else if (file.endsWith('.js')) {
        const command = require(fullPath);

        if (!command?.data || !command?.execute) continue;

        client.commands.set(command.data.name, command);
      }
    } catch (err) {
      console.error(`Error loading ${file}:`, err);
    }
  }
}

const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);

/* ---------------- READY ---------------- */
client.once('ready', async () => {
  try {
    console.log(`Logged in as ${client.user.tag}`);

    const commands = client.commands.map(cmd => cmd.data.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log(`Loaded ${commands.length} commands`);
  } catch (err) {
    console.error('Startup error:', err);
  }
});

/* ---------------- INTERACTIONS ---------------- */
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);

    const reply = {
      content: 'Error executing command.',
      flags: 64
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

/* ---------------- LOGIN ---------------- */
client.login(process.env.TOKEN);
