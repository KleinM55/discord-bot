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

/* ---------------- GLOBAL CRASH PROTECTION ---------------- */
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

/* ---------------- SAFE COMMAND LOADER ---------------- */
function loadCommands(dir) {
  if (!fs.existsSync(dir)) {
    console.log('Commands folder not found');
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        loadCommands(fullPath);
      } else if (file.endsWith('.js')) {
        const command = require(fullPath);

        if (!command?.data || !command?.execute) {
          console.log(`Invalid command skipped: ${file}`);
          return;
        }

        client.commands.set(command.data.name, command);
      }
    } catch (err) {
      console.error(`Error loading command ${file}:`, err);
    }
  }
}

loadCommands(path.join(__dirname, 'commands'));

/* ---------------- REGISTER COMMANDS ---------------- */
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

/* ---------------- INTERACTION HANDLER ---------------- */
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Command error (${interaction.commandName}):`, err);

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

/* ---------------- LOGIN ---------------- */
client.login(process.env.TOKEN);
