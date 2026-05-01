const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('لوحة الصدارة'),

  async execute(interaction) {
    const lb = eco.getLeaderboard();

    let desc = '';

    for (let i = 0; i < lb.length; i++) {
      const member = await interaction.guild.members.fetch(lb[i][0]);
      desc += `**${i + 1}.** ${member.displayName} — **${lb[i][1].total}** 🌾\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 لوحة الصدارة')
      .setDescription(desc)
      .setColor(0xf1c40f);

    await interaction.reply({ embeds: [embed] });
  }
};
