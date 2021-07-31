#!/usr/bin/env python

"""
First ChromaBot Python release!
"""

import sys, discord, random
client = discord.Client(intents=discord.Intents().all())

prefix="c."
dadPrefix=["im ", "i'm ", "i am "]
token= input("token: ") #FIXME
version= { 'release': "3_BETA",
           'release_notes': '\n+ Ported to Python'}

guildSettings={}
defaults={ 'dadbotEnabled': True }

def roll(count):
    result = random.choice(range(1, count)) #round(random.uniform(0, 1)*count)+1
    return "I rolled {}!".format(str(result))

def eball():
    responses=["It is certain.", " It is decidedly so.", "Outlook good.", "Without a doubt.", "Concentrate and ask again.", "Reply hazy, try again.", "Very doubtful.", "Outlook not so good."]
    return random.choice(responses)

def populationGuildSettings():
    global guildSettings
    for i in client.guilds:
        guildSettings[i.id] = defaults

@client.event
async def on_connect():
    print("Connected to Discord successfully, waiting for on_ready event...")

@client.event
async def on_resumed():
    print("Connection to Discord was resumed")

@client.event
async def on_private_channel_create(channel):
    print("A new DM channel was created")

@client.event
async def on_disconnect():
    print("Disconnected from Discord! Are you connected to the internet?")

@client.event
async def on_ready():
    populationGuildSettings()
    print("Logged in as {}!".format(str(client.user)))
    game = discord.Game(prefix+"help")
    await client.change_presence(status=discord.Status.online, activity=game)

@client.event
async def on_guild_join(guild):
    print("Joined guild \"" + guild.name + "\" ("+str(guild.id)+")")
    guildSettings[guild.id]=defaults

@client.event
async def on_guild_remove(guild):
    print("Left guild \"" + guild.name + "\" ("+str(guild.id)+")")
    del guildSettings[guild.id]

@client.event
async def on_message(msg):
    global guildSettings
    currentGuildSettings=guildSettings[msg.guild.id]
    senderIsAdministrator=msg.author.permissions_in(msg.channel).administrator
    async def simp(a, b, c):
        if msg.content==prefix+str(a):
            exec(c)
            await msg.channel.send(b)

    await simp("ping", "pong!",  "")
    await simp("dev", "Release: v{}".format(version['release'] + "\nRelease notes:" + version['release_notes']), "")

    if msg.content.startswith(prefix):
        base, _, rest=msg.content[len(prefix):].partition(" ")
        messageAfterCommand=rest
        rest=rest.split(" ")
        if base=="help":
            helpMessage="""c.dev - shows recent dev logs.
c.ping - replies with "Pong!".
c.avatar - shows the avatar of the user.
c.roll - rolls a die or dice, dice without number rolls a 6 pipped die, however c.roll [any number] will roll as high as [any number].
c.dadbot - does Dadbot stuff functions.
c.8ball - does 8ball stuff.
---ADMIN---
c.dadbot [enable / disable] - enables or disables dadbot."""
            cmdslist = discord.Embed(title="Commands", description=str(helpMessage), color=0xffffff)

            await msg.reply(embed=cmdslist)
        elif base=="avatar":
            #if not discord.Member(messageAfterCommand):
            #
            #else:
            #    member = discord.Member(messageAfterCommand)
            member = msg.author
            userAvatar = member.avatar_url
            await msg.reply(userAvatar)
        elif base=="roll":
            rollSuffix=""
            if len(rest) >= 1:
                try:
                    count=int(rest[0])
                except:
                    count=6 # count cannot be converted into an instance of int => has a non-numeric character
                    #rollSuffix=" Because first argument wasn't an integer"
            else:
                count=6
                rollSuffix=" Because there were no arguments"
            await msg.reply(roll(count)+rollSuffix)
        elif base=="8ball":
            await msg.reply(eball())

        if senderIsAdministrator:
            # DADBOT BEGIN
            if base=="dadbot" and not(len(rest)==0) and rest[0]=="enable":
                currentGuildSettings['dadbotEnabled']=True
                await msg.reply("Dad bot is now enabled!")
            elif base=="dadbot" and not(len(rest)==0) and rest[0]=="disable":
                currentGuildSettings['dadbotEnabled']=False
                await msg.reply("Dad bot is now disabled!")
            elif base=="dadbot" and not(len(rest)==0) and rest[0]=="toggle":
                currentGuildSettings['dadbotEnabled']=False if currentGuildSettings['dadbotEnabled'] else True #FIXME: theres probably the better method which im unaware of
                await msg.reply("Dad bot is now {}!".format("enabled" if currentGuildSettings['dadbotEnabled'] else "disabled"))
            elif base=="dadbot":
                await msg.reply("Invalid toggle! Use enable/disable/toggle or specify none at all to toggle!")
            # DADBOT END
    elif currentGuildSettings['dadbotEnabled']:
        for i in dadPrefix:
            if msg.content.lower().startswith(i):
                await msg.reply("Hi {}, I'm Dad!".format(msg.content[len(i):])) # FIXME dont mention

print(repr(guildSettings))
client.run(token)
