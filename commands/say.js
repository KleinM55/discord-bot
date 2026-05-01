const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a message as the bot')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to send')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Target channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const message = interaction.options.getString('message');
      const channel = interaction.options.getChannel('channel');

      // optional safety check (bot permissions)
      if (!channel.permissionsFor(interaction.guild.members.me).has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.EmbedLinks
      ])) {
        return interaction.reply({
          content: 'I don’t have permission to send messages in that channel.',
          flags: 64
        });
      }

      const embed = new EmbedBuilder()
        .setDescription(message)
        .setColor(0x00AEFF)
        .setFooter({ text: `Sent by ${interaction.user.tag}` })
        .setTimestamp();

      await channel.send({ embeds: [embed] });

      await interaction.reply({
        content: 'Message sent successfully ✅',
        flags: 64
      });

    } catch (error) {
      console.error('Say command error:', error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'Something went wrong while sending the message.',
          flags: 64
        });
      } else {
        await interaction.reply({
          content: 'Something went wrong while sending the message.',
          flags: 64
        });
      }
    }
  }
};
