const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collect')
    .setDescription('المكافأة الأسبوعية'),

  async execute(interaction) {
    const userId = interaction.user.id;

    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;

    if (cooldowns.has(userId)) {
      const last = cooldowns.get(userId);
      const remaining = week - (now - last);

      if (remaining > 0) {
        const days = Math.ceil(remaining / (24 * 60 * 60 * 1000));

        const embed = new EmbedBuilder()
          .setTitle('⏳ لا يمكنك الاستلام الآن')
          .setDescription(`ارجع بعد **${days} يوم**`)
          .setColor(0xe74c3c);

        return interaction.reply({ embeds: [embed], flags: 64 });
      }
    }

    const amount = eco.collectWeekly(userId);
    cooldowns.set(userId, now);

    const embed = new EmbedBuilder()
      .setTitle('🌾 حصاد أسبوعي')
      .setDescription(`لقد حصلت على **${250} محصول**`)
      .setColor(0x2ecc71)
      .setFooter({ text: 'مزرعة السحر 🌿' });

    await interaction.reply({ embeds: [embed] });
  }
};
