const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('harvest')
    .setDescription('Harvest crops'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;

      const now = Date.now();
      const cooldown = 60 * 60 * 1000;

      if (cooldowns.has(userId)) {
        const last = cooldowns.get(userId);
        const remaining = cooldown - (now - last);

        if (remaining > 0) {
          return interaction.reply({
            content: `⏳ انتظر شوي قبل الحصاد`,
            flags: 64
          });
        }
      }

      const amount = Math.floor(Math.random() * 10) + 1;

      eco.addFarm(userId, amount);
      cooldowns.set(userId, now);

      const embed = new EmbedBuilder()
        .setTitle('🌾 عملية الحصاد')
        .setDescription(
          `لقد حصدت محصولاً من القمح!\n\n💰 الكمية: **${amount} كيس قمح**`
        )
        .setColor(0x2ecc71)
        .setFooter({
          text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
        });

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Harvest error:', err);

      await interaction.reply({
        content: '❌ حدث خطأ أثناء الحصاد',
        flags: 64
      });
    }
  }
};
