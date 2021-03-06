var Discord = require("discord.js");
var mexp = require("math-expression-evaluator");
var ping = require('ping');
var Utils = require("../utils");
var CommandManager = require('../command-manager');
var aesthetics = require('aesthetics');
var http = require('http');
var Rextester = require("../rextester-helper");
var fs = require("fs");

module.exports.say = function (client, message, msg, args) {
    if (args.length > 1) {
        message.channel.send(`\`\`\`${msg.substring(4)}\`\`\``);
    }
    else {
        message.channel.send(":no_entry: `Tell me what to say u idiot...`")
    }
}

module.exports.calculate = function (client, message, msg, args) {
    var exp = msg.substring(10);
    try {
        message.channel.send(`\`\`\`${exp} = ${mexp.eval(exp)}\`\`\``);
    }
    catch (err) {
        message.channel.send(":no_entry: `Invalid expression!`")
    }
}

module.exports.help = function (client, message, msg, args) {
    if (args.length > 1) {
        var cmd = args[1].toUpperCase();
        if (CommandManager.getAliases()[cmd]) {
            cmd = CommandManager.getAliases()[cmd];
        }
        if (CommandManager.getCommands()[cmd]) {
            var help = CommandManager.getHelp(cmd);
            var embed = new Discord.RichEmbed();
            embed.setColor("BLUE");
            embed.setTitle(cmd.toLowerCase());
            embed.setURL("https://github.com/AlexandreRouma/DankBot/wiki/Command-List");
            embed.addField("Usage:", `\`${help.usage}\``);
            embed.addField("Description:", help.description);
            if (CommandManager.getAdminOnly(cmd)) {
                embed.addField("BotAdmin only:", "Yes");
            }
            else {
                embed.addField("BotAdmin only:", "No");
            }
            message.channel.send(embed);
        }
        else {
            message.channel.send(":no_entry: `Unknown command!`")
        }
    }
    else {
        message.channel.send("https://github.com/AlexandreRouma/DankBot/wiki/Command-List");
    }
}

module.exports.ping = function (client, message, msg, args) {
    ping.promise.probe("discordapp.com", {
        timeout: 10
    }).then(function (res) {
        message.channel.send(`:white_check_mark: \`${res.avg}ms\``);
    });
}

module.exports.lonely = function (client, message, msg, args) {
    message.channel.send("@everyone");
}

module.exports.dipensed = function (client, message, msg, args) {
    germanlist = fs.readFileSync("resources/lists/german-insults.txt").toString().replace(/\r/g, "").split("\n");
    message.guild.members.get("373874662024675329").setNickname(germanlist[Utils.getRandomInt(germanlist.length - 1)], "memes, idk xD");
}

module.exports.base64encode = function (client, message, msg, args) {
    if (args.length > 1) {
        var data = Buffer.from(msg.substring(13)).toString('base64');
        if (data) {
            message.channel.send(`\`\`\`${data}\`\`\``);
        }
        else {
            message.channel.send(":no_entry: `Invalid data !`");
        }
    }
    else {
        message.channel.send(":no_entry: `Tell me what to encode...`");
    }
}

module.exports.base64decode = function (client, message, msg, args) {
    if (args.length > 1) {
        var data = Buffer.from(msg.substring(13), 'base64').toString('ascii');
        if (data) {
            message.channel.send(`\`\`\`${data}\`\`\``);
        }
        else {
            message.channel.send(":no_entry: `Invalid data !`");
        }
    }
    else {
        message.channel.send(":no_entry: `Tell me what to decode...`");
    }
}

module.exports.random = function (client, message, msg, args) {
    if (args.length > 1) {
        var max = parseInt(args[1], 10);
        if (max) {
            message.channel.send(Utils.getRandomInt(max));
        }
        else {
            message.channel.send(":no_entry: `Invalid number !`");
        }
    }
    else {
        message.channel.send(":no_entry: `Tell what maximum number you want`");
    }
}

module.exports.aesthetics = function (client, message, msg, args) {
    if (args.length > 1) {
        message.channel.send(`\`\`\`${aesthetics(msg.substring(11))}\`\`\``);
    }
    else {
        message.channel.send(":no_entry: `Tell me what to make ａｅｓｔｈｅｔｉｃ");
    }
}

module.exports.mock = function (client, message, msg, args) {
    if (args.length > 1) {
        var str = "";
        for (var i = 0; i < msg.substring(5).length; i++) {
            if (Utils.getRandomInt(1)) {
                str += msg.substring(5).charAt(i).toUpperCase();
            }
            else {
                str += msg.substring(5).charAt(i);
            }
        }
        message.channel.send(`\`\`\`${str}\`\`\``);
    }
    else {
        message.channel.send(":no_entry: `TEll Me wHat to MoCK...");
    }
}

var leetspeak = {
    "a": "4",
    "e": "3",
    "i": "1",
    "l": "1",
    "o": "0",
    "s": "5",
    "t": "7",
    "z": "2",
}

module.exports.leet = function (client, message, msg, args) {
    if (args.length > 1) {
        var str = "";
        for (var i = 0; i < msg.substring(5).length; i++) {
            var c = leetspeak[msg.substring(5).charAt(i).toLowerCase()];
            if (c) {
                str += c;
            }
            else {
                str += msg.substring(5).charAt(i);
            }
        }
        message.channel.send(`\`\`\`${str}\`\`\``);
    }
    else {
        message.channel.send(":no_entry: `7311 m3 wh47 y0u w4n7 70 7r4n51473 1n70 1337 5p34k...");
    }
}

module.exports.commandstats = function (client, message, msg, args) {
    message.channel.send(`\`\`\`There are currently ${Object.keys(CommandManager.getCommands()).length} commands.\n${Object.keys(CommandManager.getAliases()).length} of them have an alias.\`\`\``);
}

var rex_first_err = true;

module; exports.run = function (client, message, msg, args) {
    rex_first_err = true;
    if (args.length > 2) {
        if (Rextester.getlanguages()[args[1]]) {
            var post = Rextester.runcode(args[1], msg.substring(5 + args[1].length));
            var post_req = http.request(post.options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    try {
                        var response = JSON.parse(chunk);
                        var embed = new Discord.RichEmbed();
                        embed.setColor("BLUE");
                        embed.setAuthor(`${message.author.username}#${message.author.discriminator}'s Code Result`, message.author.avatarURL);
                        if (response.Stats.length > 0) {
                            embed.addField("Stats", response.Stats);
                        }
                        if (response.Warnings) {
                            embed.addField("Warnings", `\`\`\`${response.Warnings}\`\`\``);
                        }
                        if (response.Errors) {
                            embed.addField("Errors", `\`\`\`${response.Errors}\`\`\``);
                        }
                        if (response.Result) {
                            if (response.Result.length > 0) {
                                var result = Utils.crop(response.Result, 1950);
                                message.channel.send(`\`\`\`${result}\`\`\``);
                                message.channel.send(embed);
                            }
                            else {
                                message.channel.send(embed);
                            }
                        }
                        else {
                            message.channel.send(embed);
                        }
                    }
                    catch (err) {
                        if (rex_first_err) {
                            rex_first_err = false;
                            message.channel.send(":no_entry: `Code ran longer than 10 seconds`");
                        }
                        return;
                    }
                });
            });
            post_req.write(post.data);
            post_req.end();
        }
        else if (args[1] == "list") {
            var str = "";
            Object.keys(Rextester.getlanguages()).forEach((e) => {
                str += e + "\n";
            });
            var embed = new Discord.RichEmbed();
            embed.setColor("BLUE");
            embed.setTitle("Supported languages");
            embed.setDescription(str);
            message.channel.send(embed);
        }
        else {
            message.channel.send(":no_entry: `Invalid language`");
        }
    }
    else if (args.length > 1) {
        if (args[1] == "list") {
            var str = "";
            Object.keys(Rextester.getlanguages()).forEach((e) => {
                str += e + "\n";
            });
            var embed = new Discord.RichEmbed();
            embed.setColor("BLUE");
            embed.setTitle("Supported languages");
            embed.setDescription(str);
            message.channel.send(embed);
        }
        else {
            message.channel.send(":no_entry: `Missing code or language name`");
        }
    }
    else {
        message.channel.send(":no_entry: `Please enter language name and code`");
    }
}

module; exports.specialthanks = function (client, message, msg, args) {
    var embed = new Discord.RichEmbed();
    embed.setColor("BLUE");
    embed.setTitle("Special Thanks");
    embed.setDescription("This bot wouldn't have been possible without these awsome people !\n" +
        "● [Dewyer](https://github.com/Dewyer)\n" +
        "● [Hollexian](https://github.com/Hollexian)\n" +
        "● MyhticalWolf");
    embed.setURL("https://github.com/AlexandreRouma/DankBot");
    message.channel.send(embed);
}

module.exports.why = function (client, message, msg, args) {
    whyresponses = fs.readFileSync("resources/lists/why-responses.txt").toString().replace(/\r/g, "").split("\n");
    message.channel.send(`\`\`\`${whyresponses[Utils.getRandomInt(whyresponses.length - 1)]}\`\`\``);
}