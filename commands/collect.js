const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collect')
    .setDescription('Collect your farm crops'),

  async execute(interaction) {
    try {
      const amount = eco.collectFarm(interaction.user.id);

      if (amount === 0) {
        return interaction.reply({
          content: '❌ ما عندك محصول تجمعه حالياً',
          flags: 64
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('🌾 تم جمع المحصول!')
        .setDescription(`جمعت **${250}** من المحصول 🌿`)
        .setColor(0x2ecc71)
        .setFooter({
          text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
        });

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ حدث خطأ أثناء الجمع',
        flags: 64
      });
    }
  }
};
