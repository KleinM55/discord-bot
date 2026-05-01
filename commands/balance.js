const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check balance')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Target user')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const user = eco.getUser(target.id);

    const embed = new EmbedBuilder()
      .setTitle('🌾 رصيدك الحالي')
      .setDescription(`🌿 محصولك الحالي **${user.farm}**`)
      .setColor(0x2ecc71)
      .setFooter({ text: `🌿 مزرعة السحر | ${new Date().toLocaleString()}` });

    await interaction.reply({ embeds: [embed] });
  }
};
