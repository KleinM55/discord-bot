const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Top farmers'),

  async execute(interaction) {
    const lb = eco.getLeaderboard();

    let desc = '';

    for (let i = 0; i < lb.length; i++) {
      const member = await interaction.guild.members.fetch(lb[i][0]);
      const name = member.displayName;

      desc += `**${i + 1}.** ${name} - ${lb[i][1].total} 🌿\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 Leaderboard')
      .setDescription(desc)
      .setColor(0xFFD700)
      .setFooter({ text: `Magic Farm 🌿 | ${new Date().toLocaleString()}` });

    await interaction.reply({ embeds: [embed] });
  }
};
