const db = require("../database/db");
const config = require("../config");
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "setup",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply("Admin only command.");

    const tier = await db.get(`tier_${message.guild.id}`) || "free";
    const limit = config.tiers[tier].limit;

    const all = await db.get(`reactions_${message.guild.id}`) || {};
    const count = Object.keys(all).length;

    if (count >= limit)
      return message.reply(`Limit reached (${limit}). Upgrade required.`);

    const msgID = args[0];
    const emoji = args[1];
    const role = message.mentions.roles.first();

    if (!msgID || !emoji || !role)
      return message.reply("Usage: !setup messageID emoji @role");

    let targetMessage;
    try {
      targetMessage = await message.channel.messages.fetch(msgID);
    } catch {
      return message.reply("Message not found.");
    }

    if (role.position >= message.guild.members.me.roles.highest.position)
      return message.reply("Role higher than bot role.");

    const emojiKey = emoji.includes(":")
      ? emoji.split(":")[2].replace(">", "")
      : emoji;

    await db.set(
      `reactions_${message.guild.id}.${msgID}_${emojiKey}`,
      role.id
    );

    message.reply("Reaction role added.");
  }
};