const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('take')
    .setDescription('Remove money from a user')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Target user').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('Amount').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    eco.removeBalance(user.id, amount);

    await interaction.reply({
      content: `❌ تم سحب ${amount} من ${user.username}`,
      flags: 64
    });
  }
};
