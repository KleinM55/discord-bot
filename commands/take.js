const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('take')
    .setDescription('Remove crops')
    .addUserOption(opt =>
      opt.setName('user').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('amount').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    eco.removeFarm(user.id, amount);

    await interaction.reply({
      content: `❌ Removed ${amount} crops`,
      flags: 64
    });
  }
};
