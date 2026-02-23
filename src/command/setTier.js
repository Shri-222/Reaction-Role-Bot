const db = require("../database/db");
const config = require("../config");

module.exports = {
  name: "set-tier",

  async execute(message, args) {
    if (message.author.id !== config.ownerId)
      return message.reply("Owner only.");

    const guildId = args[0];
    const tier = args[1];

    if (!config.tiers[tier]) return message.reply("Invalid tier.");

    await db.set(`tier_${guildId}`, tier);

    message.reply(`Server upgraded to ${tier}`);
  }
};