const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs')
const util = require('util')
const path = require('path')
const shorten = require("isgd");
const thing = require('mathjs')
const os = require('os')
const maths = thing.parser()
var request = require('superagent');
const antispam = require('discord-anti-spam');
const ms = require("ms")
bot.commands = new Discord.Collection();
const ytdl = require('ytdl-core')
const config = require('./config.json')
const coins = require("./coins.json");
const search = require('youtube-search')

let prefix = "?"





fs.readdir("./commandes/", (err, files) => {
  if(err) console.log(err);
  console.log(`${files.length} commandes`);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Commande non trouver.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commandes/${f}`);
    bot.commands.set(props.help.name, props);
  });
});


 



bot.on('ready', function(){
  console.log("je suis prêt!!!")
  setInterval(function() {

      let Statuses = [
    
        "Objectif 500 users !",
        `${bot.users.size} Users | ?help`,
        "Invite le | ?bot",
        `Sur ${bot.guilds.size} serveurs`
      ]
    
      let status = Statuses[Math.floor(Math.random() * Statuses.length)];
      bot.user.setActivity( status , { type : "WATCHING"})}, 3000)
  
    return
      });

  bot.login(config.token) //Token

  bot.on(`message`, async message => {

    bot.emit('checkMessage', message);

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let Args = messageArray.slice(1);
    var args = message.content.substring(prefix.length).split(" ");

    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(bot,message,Args,args)
  })

  var anti_spam = require("discord-anti-spam");
 
 bot.on('ready', () => {
    // Module Configuration Constructor
     antispam(bot, {
          warnBuffer: 3, // Maximum ammount of messages allowed to send in the interval time before getting warned.
          maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
          interval: 2000, // Amount of time in ms users can send the maxim amount of messages(maxBuffer) before getting banned. 
          warningMessage: "s’il vous plaît arrêter spamming!", // Message users receive when warned. (message starts with '@User, ' so you only need to input continue of it.) 
          banMessage: "tu n'a pas à spam", // Message sent in chat when user is banned. (message starts with '@User, ' so you only need to input continue of it.) 
          maxDuplicatesWarning: 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned.
          maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned.
          deleteMessagesAfterBanForPastDays: 7, // Deletes the message history of the banned user in x days.
          exemptRoles: ["Administrator"], // Name of roles (case sensitive) that are exempt from spam filter.
     })
 })

 bot.on("message", async message => {

  if(message.author.bot) return;

  if(message.channel.type === "dm") return;



  let prefixes = JSON.parse(fs.readFileSync("./config.json", "utf8"));



  if(!prefixes[message.guild.id]){

    prefixes[message.guild.id] = {

      prefixes: config.prefix

    };

  }



  if(!coins[message.author.id]){

    coins[message.author.id] = {

      coins: 0

    };

  }



  let coinAmt = Math.floor(Math.random() * 15) + 1;

  let baseAmt = Math.floor(Math.random() * 15) + 1;



  if(coinAmt === baseAmt){

    coins[message.author.id] = {

      coins: coins[message.author.id].coins + coinAmt

    };

    fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {

    if (err) console.log(err)

  });

  let coinEmbed = new Discord.RichEmbed()

  .setAuthor(message.author.username)

  .setColor("#0000FF")

  .addField("💸", `Bravo ! Tu as gagné ${coinAmt} pièces !`)

  .addField("Comment voir mon argent ?", "C'est simple ! Tu n'as qu'à faire **__?coins__**")



  message.channel.send(coinEmbed).then(msg => {msg.delete(2000)});

  }



  let xpAdd = Math.floor(Math.random() * 7) + 8;



  if(!xp[message.author.id]){

    xp[message.author.id] = {

      xp: 0,

      level: 1

    };

  }





  let curxp = xp[message.author.id].xp;

  let curlvl = xp[message.author.id].level;

  let nxtLvl = xp[message.author.id].level * 300;

  xp[message.author.id].xp =  curxp + xpAdd;

  if(nxtLvl <= xp[message.author.id].xp){

    xp[message.author.id].level = curlvl + 1;

    let lvlup = new Discord.RichEmbed()

    .setTitle("🍬 NOUVEAU NIVEAU 🍬")

    .setColor("#e500ff")

    .addField("Tu es désormais:", `Niveau ${curlvl + 1}`)

    .addField("Comment voir son niveau ?", "Fait la commande **?level**");



    message.channel.send(lvlup).then(msg => {msg.delete(20000)});

  }

  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {

    if(err) console.log(err)

  });



  let prefix = prefixes[message.guild.id].prefixes;


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);


  if(!message.content.startsWith(prefix)) return;
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);


});

