const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('إعطاء محصول (إداري)')
    .addUserOption(opt =>
      opt.setName('user').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('amount').setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    eco.addBalance(user.id, amount);

    const embed = new EmbedBuilder()
      .setTitle('✅ تم الإعطاء')
      .setDescription(`تم إعطاء **${amount} محصول** لـ ${user.username}`)
      .setColor(0x2ecc71);

    await interaction.reply({ embeds: [embed] });
  }
};
