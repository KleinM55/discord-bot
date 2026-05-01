const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collect')
    .setDescription('جمع المحصول الأسبوعي'),

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
            .setTitle('⏳ لا يمكنك الجمع الآن')
            .setDescription(`يمكنك جمع المحصول مرة أخرى بعد **${days} يوم**`)
            .setColor(0xe74c3c)
            .setFooter({
              text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
            });

          return interaction.reply({
            embeds: [embed],
            flags: 64
          });
        }
      }

      const user = eco.getUser(userId);
      const amount = user.farm;

      if (amount <= 0) {
        return interaction.reply({
          content: '❌ لا يوجد لديك أي محصول لجمعه',
          flags: 64
        });
      }

      eco.removeFarm(userId, amount);
      cooldowns.set(userId, now);

      const embed = new EmbedBuilder()
        .setTitle('📦 تم جمع المحصول الأسبوعي')
        .setDescription(`🎉 لقد قمت بجمع كل محصولك بنجاح!\n\n🌾 الكمية: **${250} كيس قمح**`)
        .setColor(0x2ecc71)
        .setFooter({
          text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
        });

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Collect error:', err);

      await interaction.reply({
        content: '❌ حدث خطأ أثناء جمع المحصول',
        flags: 64
      });
    }
  }
};
