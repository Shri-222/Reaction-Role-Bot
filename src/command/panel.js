const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../database/db");

module.exports = {
  name: "panel",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply("Admin only command.");

    if (args[0] !== "create") return;

    const filter = (m) => m.author.id === message.author.id;

    await message.reply("Send panel **title**");

    const title = (await message.channel.awaitMessages({ filter, max: 1, time: 60000 })).first();
    if (!title) return message.reply("Timeout.");

    await message.channel.send("Send panel **description**");

    const desc = (await message.channel.awaitMessages({ filter, max: 1, time: 60000 })).first();
    if (!desc) return message.reply("Timeout.");

    const roles = [];

    await message.channel.send(
      "Send emoji + role mention (example: 😀 @Member). Type `done` when finished."
    );

    while (true) {
      const msg = (await message.channel.awaitMessages({ filter, max: 1, time: 60000 })).first();
      if (!msg) return message.reply("Timeout.");

      if (msg.content.toLowerCase() === "done") break;

      const role = msg.mentions.roles.first();
      const emoji = msg.content.split(" ")[0];

      if (!role) {
        message.channel.send("Invalid format. Try again.");
        continue;
      }

      roles.push({ emoji, role });
      message.channel.send("Added.");
    }

    if (roles.length === 0) return message.reply("No roles added.");

    const embed = new EmbedBuilder()
      .setTitle(title.content)
      .setDescription(desc.content)
      .setColor("#5865F2");

    roles.forEach((r) => {
      embed.addFields({ name: r.role.name, value: r.emoji, inline: true });
    });

    const panelMessage = await message.channel.send({ embeds: [embed] });

    for (const r of roles) {
      await panelMessage.react(r.emoji);

      const emojiKey = r.emoji.includes(":")
        ? r.emoji.split(":")[2].replace(">", "")
        : r.emoji;

      await db.set(
        `reactions_${message.guild.id}.${panelMessage.id}_${emojiKey}`,
        r.role.id
      );
    }

    message.channel.send("Reaction panel created.");
  }
};