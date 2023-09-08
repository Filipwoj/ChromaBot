import os
import discord
import random
from config import config

if config['AskForToken'] == True:
    my_token = input("Token: ")
else:
    my_token = config['Token']

bot = discord.Bot()

help_message = """
## Help

- **chelp** — Command to show help text.
- **ping** — Bot replies with a "pong!" 
- **avatar** [*user*] — Give avatar of the user. By default it will give your avatar, optionally target a user. :asterisk:
- **roll** [*int*] — Pseudorandom number generator that rolls a six-sided die by default. You can roll an *n* sided die by giving an argument.
- **8ball** [Question] —  The classic Magic 8 Ball, provides an answer to a yes or no question.

### Admin

- **dadbot toggle** — toggle the Dadbot functionality. Does not edit the config file. :x:
"""

@bot.event
async def on_ready():
    print(f"{bot.user} is ready and online!")
    await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.listening, name="/chelp"))

# TODO: clean this up
@bot.slash_command(name = "ping", description = "Pong!")
async def ping(ctx):
    await ctx.respond("Pong!")

@bot.slash_command(name = "chelp", description = "Print the helplist for ChromaBot.")
async def chelp(ctx):
    await ctx.respond(help_message)

@bot.slash_command(name = "roll", description = "Roll a *n*-sided die, otherwise six-sided.")
async def roll(ctx, i: discord.Option(int, name = "int", description = "Highest number that can be rolled.", required = False) = 6):
    
    result = random.choice(range(i)) + 1
    await ctx.respond("I rolled {}!".format(str(result)))

@bot.slash_command(name = "8ball", description = "Ask the 8 Ball something.")
async def eball(ctx, i: discord.Option(name= "question", description = "Your question for the bot.", required = True)):
    
    responses = ["It is certain.", "It is decidedly so.",
                 "Outlook good.", "Without a doubt.",
                 "Concentrate and ask again.", "Reply hazy, try again.",
                 "Very doubtful.", "Outlook not so good."]
    
    result =  random.choice(responses)
    await ctx.respond("> {}\n**{}**".format(i, result))

@bot.slash_command(name = "avatar", description = "Grab an avatar") # I. Hate. This. #$!&.
async def avatar_grab(ctx): # TODO: Make it target people
    
    await ctx.respond(ctx.author.avatar.url)

bot.run(my_token)
