const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('take')
    .setDescription('سحب محصول من لاعب')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('اختر اللاعب')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('amount')
        .setDescription('كمية المحصول')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (amount <= 0) {
      return interaction.reply({
        content: '❌ يجب أن تكون الكمية أكبر من صفر',
        flags: 64
      });
    }

    eco.removeBalance(user.id, amount);

    const embed = new EmbedBuilder()
      .setTitle('❌ تم سحب المحصول')
      .setDescription(`تم سحب **${amount} محصول** من ${user.username}`)
      .setColor(0xe74c3c)
      .setFooter({ text: 'مزرعة السحر 🌿' });

    await interaction.reply({ embeds: [embed] });
  }
};
