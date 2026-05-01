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

/* ---------------- CLIENT ---------------- */
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

/* ---------------- CRASH PROTECTION ---------------- */
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

/* ---------------- COMMAND LOADER ---------------- */
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

        // 🛡️ حماية من الملفات الخربانة
        if (!command?.data || !command?.execute) {
          console.log(`⚠️ Skipped invalid command: ${file}`);
          continue; // ✅ FIXED (was return ❌)
        }

        if (!command.data.name) {
          console.log(`⚠️ Command missing name: ${file}`);
          continue;
        }

        client.commands.set(command.data.name, command);
      }
    } catch (err) {
      console.error(`❌ Error loading command ${file}:`, err);
    }
  }
}

loadCommands(path.join(__dirname, 'commands'));

/* ---------------- READY EVENT ---------------- */
client.once('ready', async () => {
  try {
    console.log(`Logged in as ${client.user.tag}`);

    const commands = client.commands
      .map(cmd => {
        try {
          return cmd.data.toJSON();
        } catch (e) {
          console.log(`⚠️ Failed to register command: ${cmd.data?.name}`);
          return null;
        }
      })
      .filter(cmd => cmd !== null);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log(`✅ Loaded ${commands.length} commands`);

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
      content: '⚠️ حصل خطأ أثناء تنفيذ الأمر.',
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
