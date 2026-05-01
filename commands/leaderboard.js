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
      const name = member.displayName;

      desc += `**${i + 1}.** ${name} — **${lb[i][1].total} كيس قمح** 🌾\n`;
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
