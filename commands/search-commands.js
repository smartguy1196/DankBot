var Discord = require("discord.js");
var urban = require("urban");
var Utils = require("../utils");
var GoogleImages = require('google-images');
var GoogleSearch = require('google-search');
var ytsearch = require('youtube-search');
var opts;

var gimages;
var gsearch;

module.exports.initGoogleImages = function (gi) {
    gimages = gi;
}

module.exports.initGoogleSearch = function (gs) {
    gsearch = gs;
}

module.exports.initYoutubeAPIKey = function (key) {
    opts = {
        maxResults: 10,
        key: key
    };
}

module.exports.urban = function (client, message, msg, args) {
    if (args.length > 1) {
        if (args[1].toUpperCase() == "-R-") {
            urban.random().first(function (definition) {
                if (definition) {
                    var embed = new Discord.RichEmbed();
                    embed.setColor("BLUE");
                    embed.setTitle(definition.word);
                    embed.setURL(definition.permalink);
                    embed.setDescription(Utils.crop(definition.definition, 2048));
                    if (definition.example) {
                        embed.addField("Example:", Utils.crop(definition.example, 1024));
                    }
                    else {
                        embed.addField("Example:", "__*none*__");
                    }
                    embed.setFooter(`By ${definition.author}`);
                    message.channel.send(embed)
                }
                else {
                    message.channel.send(":no_entry: `Could not get random word`")
                }
            });
        }
        else {
            urban(msg.substring(6)).first(function (definition) {
                if (definition) {
                    var embed = new Discord.RichEmbed();
                    embed.setColor("BLUE");
                    embed.setTitle(definition.word);
                    embed.setURL(definition.permalink);
                    embed.setDescription(Utils.crop(definition.definition, 2048));
                    if (definition.example) {
                        embed.addField("Example:", Utils.crop(definition.example, 1024));
                    }
                    else {
                        embed.addField("Example:", "__*none*__");
                    }
                    embed.setFooter(`By ${definition.author}`);
                    message.channel.send(embed)
                }
                else {
                    message.channel.send(":no_entry: `No result :/`")
                }
            });
        }
    }
    else {
        message.channel.send(":no_entry: `Tell me what to seach on urban...`")
    }
}

module.exports.image = function (client, message, msg, args) {
    if (args.length > 1) {
        try {
            gimages.search(msg.substring(6))
                .then(images => {
                    var image = images[0];
                    if (image) {
                        message.channel.send(new Discord.Attachment(image.url));
                    }
                    else {
                        message.channel.send(":no_entry: `No result :/`");
                    }
                });
        }
        catch (err) {
            message.channel.send(":no_entry: `Google Images service not available :/`");
        }
    }
    else {
        message.channel.send(":no_entry: `Tell me what to search on Google Images...`");
    }
}

module.exports.google = function (client, message, msg, args) {
    if (args.length > 1) {
        gsearch.build({
            q: msg.substring(7),
            gl: "us",
            num: 1
        }, function (error, response) {
            if (error) {
                message.channel.send(":no_entry: `Google Search service not available :/`");
            }
            else {
                if (response.items) {
                    var embed = new Discord.RichEmbed();
                    embed.setColor("BLUE");
                    embed.setTitle(response.items[0].title);
                    embed.setURL(response.items[0].link);
                    embed.setDescription(response.items[0].snippet);
                    embed.setFooter(`Took ${response.searchInformation.searchTime}s to find ${response.searchInformation.formattedTotalResults} results.`);
                    message.channel.send(embed);
                }
                else {
                    message.channel.send(":no_entry: `No result :/`");
                }
            }
        });
    }
    else {
        message.channel.send(":no_entry: `Tell me what to search on Google...`");
    }
}

module.exports.youtube = function (client, message, msg, args) {
    if (args.length > 1) {
        ytsearch(msg.substring(5), opts, function (yterr, results) {
            if (yterr) {
                message.channel.send(":no_entry: `That video doesn't exist nigga`:joy:" + yterr.message)
                return;
            }
            message.channel.send(results[0].link);
        });
    }
    else {
        message.channel.send(":no_entry: `Tell me what to search on Google...`");
    }
}