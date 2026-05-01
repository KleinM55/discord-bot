const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collect')
    .setDescription('View your crops'),

  async execute(interaction) {
    const user = eco.getUser(interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle('🌾 Farm Status')
      .setDescription(`You have **${user.farm}** crops 🌿`)
      .setColor(0x2ecc71)
      .setFooter({ text: `Magic Farm 🌿 | ${new Date().toLocaleString()}` });

    await interaction.reply({ embeds: [embed] });
  }
};
