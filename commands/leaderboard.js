const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Top players leaderboard'),

  async execute(interaction) {
    const lb = eco.getLeaderboard();

    if (lb.length === 0) {
      return interaction.reply({
        content: 'ما في بيانات حالياً',
        flags: 64
      });
    }

    let desc = '';

    for (let i = 0; i < lb.length; i++) {
      const user = await interaction.client.users.fetch(lb[i][0]);
      desc += `**${i + 1}.** ${user.username} - ${lb[i][1].total} 🌿\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 لوحة الصدارة')
      .setDescription(desc)
      .setColor(0xFFD700)
      .setFooter({
        text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
