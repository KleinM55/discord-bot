const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collect')
    .setDescription('المكافأة الأسبوعية'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;

      const now = Date.now();
      const week = 7 * 24 * 60 * 60 * 1000;

      if (cooldowns.has(userId)) {
        const last = cooldowns.get(userId);
        const remaining = week - (now - last);

        if (remaining > 0) {
          const days = Math.ceil(remaining / (24 * 60 * 60 * 1000));

          const embed = new EmbedBuilder()
            .setTitle('⏳ لا يمكنك استلام المكافأة الآن')
            .setDescription(`يمكنك استلام المكافأة مرة أخرى بعد **${days} يوم**`)
            .setColor(0xe74c3c)
            .setFooter({
              text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
            });

          return interaction.reply({ embeds: [embed], flags: 64 });
        }
      }

      const amount = eco.collectWeekly(userId);
      cooldowns.set(userId, now);

      const embed = new EmbedBuilder()
        .setTitle('🎁 المكافأة الأسبوعية')
        .setDescription(`لقد حصلت على مكافأتك الأسبوعية بنجاح!\n\n💰 الكمية: **${amount} عملة**`)
        .setColor(0x2ecc71)
        .setFooter({
          text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
        });

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Collect error:', err);

      await interaction.reply({
        content: '❌ حدث خطأ أثناء استلام المكافأة',
        flags: 64
      });
    }
  }
};
