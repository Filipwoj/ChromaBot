//Bot version: 2.0.0
//You look fire, girl. You should join the Chromaverse server https://discord.gg/e229Wvp && my server https://discord.gg/EdQwYG2
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "c.";
const dadPrefix = ["i'm ", "im ", "i am "];
const token = 'Placeholder'; // super secret token
const version = "+ version 2, runs 24/7\n+ Open source, yay! \n/will update,";

var dadbotEnabled = false;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(prefix + "help");
});

//  die / dice roller -- perfect!
roll = (arg) => {
    let n;
    if (arg === '') {
        n = 6;
    } else {
        n = +arg;
    }
    let result = Math.floor(Math.random() * n) + 1;
    if (result === NaN) {
        return "That is not a valid number";
    } else {
        return "I rolled " + result + "!";
    }
};

eball = () => {
    const resp = ["It is certain.", " It is decidedly so.", "Outlook good.", "Without a doubt.", "Concentrate and ask again.", "Reply hazy, try again.", "Very doubtful.", "Outlook not so good."]; //Thanks Gosha!
    return resp[Math.floor(Math.random() * resp.length)];
}

client.on('message', msg => {
    //simpleton -- use for simple stuff
    simp = (a, b, c) => {
        if (msg.content === prefix + a) {
            msg.channel.send(b);
            c;
        }
    }

    simp("ping", "pong!", "");

    if (msg.content === prefix + 'help') {
        const cmdslist = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setDescription('c.dev - shows recent dev logs.\nc.ping - replies with "Pong!"\nc.avatar - shows the avatar of the user\nc.roll - rolls a die or dice, dice without number rolls a 6 pipped die, however c.roll [any number] will roll as high as [any number] \n Dadbot stuff functions. \n c.8ball - does 8ball stuff');
        msg.channel.send(cmdslist);
        //msg.channel.send('```c.ping - replies with "Pong!"\nc.avatar - shows the avatar of the user\nc.roll - rolls a die or dice, dice without number rolls a 6 pipped die, however c.dice 24 rolls a 24 pipped die / dice```');
    } //msg.channel.send to send without @
    if (msg.content === prefix + "avatar") {
        msg.reply(msg.author.displayAvatarURL());
    }
    if (msg.content.slice(0, prefix.length + 4) === prefix + 'roll') {
        msg.reply(roll(msg.content.slice(prefix.length + 5))); //let's do an else if that does something like c.dice 24, rebrand 2 c.roll ? and possibly try to get a random thing in
    }
    if (msg.content === prefix + "enable dadbot") {
        dadbotEnabled = true;
    }
    if (msg.content === prefix + "disable dadbot") {
        dadbotEnabled = false;
    }

    // Dadbot
    if (dadbotEnabled) {
        for (let i = 0; i < dadPrefix.length; i++) {
            let p = dadPrefix[i];
            if (msg.content.toLowerCase().slice(0, p.length) === p) {
                msg.channel.send("Hi " + msg.content.slice(p.length) + ", I'm Dad!");
            }
        }
    }

    //8ball

    if (msg.content === prefix + "8ball " + msg.content.slice(prefix.length + "8ball ".length)) {
        msg.reply(eball())
    }
    //dev stuff

    simp("dev", version, "");
});

client.login(token);
//credits 2: Kernel & Vladislav for being OG devs - Filip
