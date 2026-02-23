# Reaction Role Bot

A powerful Discord bot that automatically assigns roles to users based on emoji reactions on messages.

## Features

✨ **Easy Setup** - Simple command to link emojis to roles
🎯 **Automatic Role Assignment** - Users get roles instantly when they react
⚡ **Fast & Reliable** - Built with discord.js
🔐 **Admin Only** - Only server administrators can configure the bot
💾 **Persistent** - Reactions are saved in the database

## Installation

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- A Discord bot token

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shri-222/Reaction-Role-Bot
cd reaction-role-bot
```

### Step 2: Install Dependencies
```bash
npm install discord.js dotenv quick.db better-sqlite3
```

### Step 3: Create a .env File
```bash
DISCORD\_TOKEN=your\_bot\_token\_here
```

### Step 4: Start the Bot
```bash
node index.js
```
### Setup Instructions
#### 1. Invite the Bot to Your Server
   - Go to Discord Developer Portal
   - Select your bot → OAuth2 → URL Generator
   - Select scopes: bot
   - Select permissions: Send Messages, Manage Roles, Read Message History, Add Reactions
   - Copy the generated URL and open it in your browser

#### 2. Enable Gateway Intents
   - Go to your bot in Discord Developer Portal
   - Click Bot
   - Enable these intents:
   - ✓ Server Members Intent
   - ✓ Message Content Intent

#### 3. Create a Role (if you don't have one)
Go to your Discord server → Server Settings → Roles → Create Role

#### 4. Use the Setup Command
##### Send this command in your Discord server (replace with your details):
```bash
!setup [MESSAGE\_ID] [EMOJI] @RoleName
```
##### Example:
```bash
!setup 1475398279058423940 🎮 @Gamer
```

##### Breaking Down the Command
   - MESSAGE_ID - The ID of the message where users will react
   - EMOJI - The emoji users will click (e.g., 🎮, 🎨, 🎵)
   - @RoleName - The role to assign (mention it with @)

##### How It Works for Users
   - User sees the message with the emoji
   - User clicks/reacts with the emoji
   - Bot automatically assigns the role to the user
   - User can remove the reaction to get the role removed

### Configuration
Edit the PREFIX in your .env file to change the command prefix (default is !).

### Troubleshooting

#### Bot can't find the role
   - Make sure the role exists in your server
   - Make sure you're using @RoleName or the role ID
   - Check that the bot has permission to manage roles

#### Bot doesn't respond to commands
   - Make sure the message starts with the PREFIX (default !)
   - Make sure you're an admin to use the setup command
   - Check that Message Content Intent is enabled

#### Reactions aren't working
   - Make sure the bot has permission to add reactions
   - Make sure the message ID is correct
   - Check the console for error messages

### Commands
| Command |	                Usage            |	Description             |
|---------|----------------------------------|--------------------------|
|  setup  |	!setup [MessageID] [Emoji] @Role |	Link an emoji to a role |

### Technologies Used
   - discord.js - Discord bot framework
   - Node.js - JavaScript runtime
   - Dotenv - Environment variable management

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Support
Need help? Create an issue on GitHub or join our Discord server.

### Contributing
Pull requests are welcome! Please fork the repository and create a pull request with your changes. 

