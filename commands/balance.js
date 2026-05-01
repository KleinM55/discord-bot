const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance'),

  async execute(interaction) {
    const user = eco.getUser(interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle('💰 رصيدك')
      .setDescription(`💵 الرصيد: **${user.balance}**\n🌾 المحصول: **${user.farm}**`)
      .setColor(0x3498db)
      .setFooter({
        text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
