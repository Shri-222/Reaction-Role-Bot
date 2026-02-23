const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
require('dotenv').config();

const db = new QuickDB();

const PREFIX = process.env.PREFIX;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User],
});

client.on('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

// SETUP COMMAND
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'setup') {
        try {
            if (!message.member.permissions.has("Administrator")) {
                return message.reply("Only admins can do this!");
            }

            const msgID = args[0];
            const emoji = args[1];
            const role = message.mentions.roles.first() || 
                        message.guild.roles.cache.find(r => r.name.toLowerCase() === args[2]?.toLowerCase());

            console.log('All args:', args);
            console.log('args[0]:', args[0]);
            console.log('args[1]:', args[1]);
            console.log('args[2]:', args[2]);
            console.log('Mentioned roles:', message.mentions.roles.size);
            console.log('Guild roles:', message.guild.roles.cache.map(r => r.name));


            if (!msgID || !emoji || !role) {
                return message.reply("**Usage:** `!setup [MessageID] [Emoji] [@Role]`\n\n**Example:** `!setup 1234567890 🎮 @Gamer`");
            }

            // Save to database
            await db.set(`reactions_${message.guild.id}_${msgID}_${emoji}`, role.id);
            message.reply(`Linked ${emoji} → ${role.name} for message \`${msgID}\`!`);
        } catch (error) {
            console.error(error);
            message.reply("An error occurred. Check the console.");
        }
    }
});

// REACTION ADD
client.on('messageReactionAdd', async (reaction, user) => {
    try {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch();

        const roleId = await db.get(`reactions_${reaction.message.guild.id}_${reaction.message.id}_${reaction.emoji.name}`);
        
        if (roleId) {
            const member = await reaction.message.guild.members.fetch(user.id);
            const role = reaction.message.guild.roles.cache.get(roleId);
            
            if (member && role) {
                await member.roles.add(role);
                console.log(`Added role to ${user.tag}`);
            }
        }
    } catch (error) {
        console.error("Error adding role:", error);
    }
});

// REACTION REMOVE
client.on('messageReactionRemove', async (reaction, user) => {
    try {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch();

        const roleId = await db.get(`reactions_${reaction.message.guild.id}_${reaction.message.id}_${reaction.emoji.name}`);
        
        if (roleId) {
            const member = await reaction.message.guild.members.fetch(user.id);
            if (member) {
                await member.roles.remove(roleId);
                console.log(`Removed role from ${user.tag}`);
            }
        }
    } catch (error) {
        console.error("Error removing role:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);
