const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

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
        .setDescription('Channel to send the message in')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel');

    const embed = new EmbedBuilder()
      .setTitle('Message')
      .setDescription(message)
      .setColor(0x00AEFF)
      .setFooter({ text: `Sent by ${interaction.user.tag}` });

    await channel.send({ embeds: [embed] });

    await interaction.reply({
      content: 'Message sent successfully ✅',
      ephemeral: true
    });
  }
};
