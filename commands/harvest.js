const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// cooldown storage (in memory)
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('harvest')
    .setDescription('Harvest crops every hour'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const now = Date.now();

    const cooldownTime = 60 * 60 * 1000; // 1 hour

    // check cooldown
    if (cooldowns.has(userId)) {
      const lastTime = cooldowns.get(userId);
      const remaining = cooldownTime - (now - lastTime);

      if (remaining > 0) {
        const minutes = Math.ceil(remaining / 60000);

        return interaction.reply({
          content: `⏳ لازم تنتظر ${minutes} دقيقة قبل الحصاد مرة ثانية`,
          flags: 64
        });
      }
    }

    // random harvest 1 - 10
    const amount = Math.floor(Math.random() * 10) + 1;

    cooldowns.set(userId, now);

    const embed = new EmbedBuilder()
      .setTitle('🌾 حصاد ناجح!')
      .setDescription(`لقد حصلت على **${amount}** من المحصول 🌿`)
      .setColor(0x2ecc71)
      .setFooter({
        text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
