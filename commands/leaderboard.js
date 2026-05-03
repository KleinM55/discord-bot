const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('عرض ترتيب اللاعبين'),

  async execute(interaction) {
    const lb = eco.getLeaderboard();

    let desc = '';

    for (let i = 0; i < lb.length; i++) {
      const userId = lb[i][0];
      const data = lb[i][1];

      let name = 'مستخدم غير معروف';

      // 🟢 حاول من السيرفر
      const member = await interaction.guild.members
        .fetch(userId)
        .catch(() => null);

      if (member) {
        name = member.displayName;
      } else {
        // 🟡 إذا طالع من السيرفر → جيب username
        const user = await interaction.client.users
          .fetch(userId)
          .catch(() => null);

        if (user) {
          name = user.username;
        }
      }

      desc += `**${i + 1}.** ${name} — **${data.total} محصول** 🌾\n`;
    }

    if (!desc) {
      desc = 'لا يوجد لاعبين حالياً';
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 لوحة الصدارة')
      .setDescription(desc)
      .setColor(0xf1c40f)
      .setFooter({ text: 'مزرعة السحر 🌿' });

    await interaction.reply({ embeds: [embed] });
  }
};
