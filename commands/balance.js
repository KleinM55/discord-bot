const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check farm')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Target user')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const user = eco.getUser(target.id);

    const embed = new EmbedBuilder()
      .setTitle('🌾 Farm Info')
      .setDescription(`🌿 Crops: **${user.farm}**`)
      .setColor(0x2ecc71)
      .setFooter({ text: `Magic Farm 🌿 | ${new Date().toLocaleString()}` });

    await interaction.reply({ embeds: [embed] });
  }
};
