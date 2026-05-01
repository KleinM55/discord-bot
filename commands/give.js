const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const eco = require('../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('إعطاء محصول للاعب')
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

    eco.addBalance(user.id, amount);

    const embed = new EmbedBuilder()
      .setTitle('✅ تم إعطاء المحصول')
      .setDescription(`تم إعطاء **${amount} محصول** إلى ${user.username}`)
      .setColor(0x2ecc71)
      .setFooter({ text: 'مزرعة السحر 🌿' });

    await interaction.reply({ embeds: [embed] });
  }
};
