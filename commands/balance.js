const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('عرض المحصول')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('اختيار لاعب')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const user = eco.getUser(target.id);

    const embed = new EmbedBuilder()
      .setTitle('💰 المحصول')
      .setDescription(`👤 ${target.username}\n🌾 المحصول: **${user.balance}**`)
      .setColor(0x2ecc71)
      .setFooter({ text: 'مزرعة السحر 🌿' });

    await interaction.reply({ embeds: [embed] });
  }
};
