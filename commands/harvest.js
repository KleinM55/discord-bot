const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

// cooldown (بالذاكرة)
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('harvest')
    .setDescription('حصاد المحصول من المزرعة'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const now = Date.now();

      const cooldownTime = 60 * 60 * 1000; // ساعة

      // 🔒 التحقق من الكولداون
      if (cooldowns.has(userId)) {
        const last = cooldowns.get(userId);
        const remaining = cooldownTime - (now - last);

        if (remaining > 0) {
          const minutes = Math.ceil(remaining / 60000);

          return interaction.reply({
            content: `⏳ لازم تنتظر ${minutes} دقيقة قبل ما تحصد مرة ثانية`,
            flags: 64
          });
        }
      }

      // 🎲 عشوائي من 1 إلى 10
      const amount = Math.floor(Math.random() * 10) + 1;

      // 💾 حفظ بالمزرعة
      eco.addFarm(userId, amount);

      // تحديث وقت الكولداون
      cooldowns.set(userId, now);

      // 🌾 Embed
      const embed = new EmbedBuilder()
        .setTitle('🌾 حصاد ناجح!')
        .setDescription(`حصلت على **${amount}** من المحصول 🌿`)
        .setColor(0x2ecc71)
        .setFooter({
          text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
        });

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Harvest error:', err);

      await interaction.reply({
        content: '❌ صار خطأ أثناء الحصاد',
        flags: 64
      });
    }
  }
};
