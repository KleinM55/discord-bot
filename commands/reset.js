const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

function load() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset user data')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Target user')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');

      const data = load();

      if (!data[target.id]) {
        return interaction.reply({
          content: '❌ هذا المستخدم ما عنده بيانات أصلاً',
          flags: 64
        });
      }

      // حذف بياناته
      delete data[target.id];

      save(data);

      const embed = new EmbedBuilder()
        .setTitle('🗑️ تم إعادة التعيين')
        .setDescription(`تم حذف جميع بيانات ${target.username}`)
        .setColor(0xe74c3c)
        .setFooter({
          text: `مزرعة السحر 🌿 | ${new Date().toLocaleString()}`
        });

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ حدث خطأ أثناء الريسيت',
        flags: 64
      });
    }
  }
};
