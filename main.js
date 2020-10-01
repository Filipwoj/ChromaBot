// Bot version: 2.1.0
// You look fire, girl. You should join the Chromaverse server https://discord.gg/e229Wvp && my server https://discord.gg/EdQwYG2
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "c.";
const dadPrefix = ["i'm ", "im ", "i am "];
const token = 'placeholder'; // super secret token
const version = "+ version 2, runs 24/7\n+ Open source, yay! \n/will update.";

/** @type {Record<string, { dadbotEnabled: boolean }>} */
var guildSettings = {};
const defaults = { dadbotEnabled: true };

function populationGuildSettings() {
    for (const [guildId, _] of client.guilds.cache) {
        guildSettings[guildId] = { ...defaults };
    }
}

client.on("guildCreate", (guild) => {
    guildSettings[guild.id] = { ...defaults };
});

client.on("guildDelete", (guild) => {
    delete guildSettings[guild.id];
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(prefix + "help");
});

/**
 * die / dice roller -- perfect!
 * @param {number} count
 */
function roll(count) {
    const result = Math.floor(Math.random() * count) + 1;
    return `I rolled ${result}!`;
}

function eball() {
    const responses = [
        "It is certain.", " It is decidedly so.", "Outlook good.", "Without a doubt.", "Concentrate and ask again.", "Reply hazy, try again.",
        "Very doubtful.", "Outlook not so good."
    ]; // Thanks Gosha!

    return responses[Math.floor(Math.random() * responses.length)];
}

client.on('message', async (msg) => {
    const currentGuildSettings = guildSettings[msg.guild.id];
    const senderIsAdministrator = msg.member.hasPermission("ADMINISTRATOR");

    // simpleton -- use for simple stuff
    const simp = async (a, b, c) => {
        if (msg.content === prefix + a) {
            await msg.channel.send(b);
            c;
        }
    }

    await simp("ping", "pong!", "");
    await simp("dev", version, ""); // dev stuff

    if (msg.content.startsWith(prefix)) {
        // c.hello world how are you
        // ["hello", ["world", "how", "are", "you"]]
        // "world how are you"
        const [base, ...rest] = msg.content.slice(prefix.length).split(/ +/);
        const messageAfterCommand = msg.content.slice(prefix.length + base.length).trim();

        switch (base) {
            case "help": {
                let helpMessage =
`c.dev - shows recent dev logs.
c.ping - replies with "Pong!".
c.avatar - shows the avatar of the user.
c.roll - rolls a die or dice, dice without number rolls a 6 pipped die, however c.roll [any number] will roll as high as [any number].
 Dadbot - does Dadbot stuff functions.
c.8ball - does 8ball stuff.
---ADMIN---
c.dadbot [enable / disable] - enables or disables dadbot.`;
        
                const cmdslist = new Discord.MessageEmbed()
                    .setTitle("Commands")
                    .setDescription(helpMessage);
                await msg.reply(cmdslist);
            } return;

            case "avatar": {
                await msg.reply(msg.author.displayAvatarURL(), { disableMentions: "all" });
            } return;

            case "roll": {
                const count = rest.length >= 1 ? parseInt(rest[0]) : 6;
                await msg.reply(roll(count), { disableMentions: "all" });
            } return;

            case "8ball": {
                await msg.reply(eball())
            } return;
        }

        if (senderIsAdministrator) {
            switch (base) {
                case "dadbot": {
                    switch (rest.length >= 1 ? rest[0] : null) {
                        case "enable": {
                            currentGuildSettings.dadbotEnabled = true;
                        } break;

                        case "disable": {
                            currentGuildSettings.dadbotEnabled = false;
                        } break;

                        case "toggle":
                        case null: {
                            currentGuildSettings.dadbotEnabled = !currentGuildSettings.dadbotEnabled;
                        } break;

                        default: {
                            await msg.reply("Invalid toggle! Use enable/disable/toggle or specify none at all to toggle!");
                        } return;
                    }

                    await msg.reply(`Dad bot is now ${currentGuildSettings.dadbotEnabled ? "enabled" : "disabled"}!`);
                } return;
            }
        }
    }
    // Dadbot
    else if (currentGuildSettings.dadbotEnabled) {
        for (let i = 0; i < dadPrefix.length; i++) {
            const prefix = dadPrefix[i];
            if (msg.content.toLowerCase().startsWith(prefix)) {
                await msg.reply("Hi " + msg.content.slice(prefix.length).trim() + ", I'm Dad!", { disableMentions: "all" });
            }
        }
    }
});

client.login(token).then(populationGuildSettings);
//credits 2: Kernel & Vladislav for being OG devs - Filip
//Thank you SirJosh for making a very big contribution to this project!
