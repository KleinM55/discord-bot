const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('take')
    .setDescription('سحب محصول (إداري)')
    .addUserOption(opt =>
      opt.setName('user').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('amount').setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    eco.removeBalance(user.id, amount);

    const embed = new EmbedBuilder()
      .setTitle('❌ تم السحب')
      .setDescription(`تم سحب **${amount} محصول** من ${user.username}`)
      .setColor(0xe74c3c);

    await interaction.reply({ embeds: [embed] });
  }
};
