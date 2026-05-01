const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give money to a user')
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

    eco.addBalance(user.id, amount);

    await interaction.reply({
      content: `✅ تم إعطاء ${amount} إلى ${user.username}`,
      flags: 64
    });
  }
};
