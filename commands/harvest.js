const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('harvest')
    .setDescription('حصاد المحصول'),

  async execute(interaction) {
    const userId = interaction.user.id;

    const now = Date.now();
    const cooldown = 60 * 60 * 1000;

    if (cooldowns.has(userId)) {
      const last = cooldowns.get(userId);
      const remaining = cooldown - (now - last);

      if (remaining > 0) {
        const minutes = Math.ceil(remaining / 60000);

        const embed = new EmbedBuilder()
          .setTitle('⏳ لا يمكنك الحصاد الآن')
          .setDescription(`يجب عليك الانتظار **${minutes} دقيقة** قبل الحصاد مرة أخرى`)
          .setColor(0xe74c3c)
          .setFooter({
            text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
          });

        return interaction.reply({ embeds: [embed], flags: 64 });
      }
    }

    const amount = Math.floor(Math.random() * 15) + 1;

    eco.addFarm(userId, amount);
    cooldowns.set(userId, now);

    const embed = new EmbedBuilder()
      .setTitle('🌾 عملية الحصاد')
      .setDescription(`لقد حصدت محصولاً من القمح!\n\n💰 الكمية: **${amount} كيس قمح**`)
      .setColor(0x2ecc71)
      .setFooter({
        text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
