var Botkit = require('botkit');

if (!process.env.PORT || !process.env.TEAM_ID) {
    console.log('Error: Specify PORT and TEAM_ID in environment');
    process.exit(1);
}

var config = {};

var controller = Botkit.slackbot(config).configureSlackApp(
    {
         clientId: "xxx.yyy", // we don't care about these at all, since we're only responding
         clientSecret: "123",
        scopes: ['commands']
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});

// We need to store the teamId in storage or else this thing won't work. Weird quirk w/ api
controller.storage.teams.save({id: process.env.TEAM_ID}, function(err){
    if(err)
      console.error(err)
});


// Here's the (light) meat and taters

controller.on('slash_command', function (slashCommand, message) {

    switch (message.command) {
        case "/stand": // handles stand logic. spits out generic response if empty and stand name if given one

            // if no text was supplied, spit out generic copy
            if (message.text === "") {
                slashCommand.replyPublic(message,
                    "ＴＨＩＳ 　ＭＵＳＴ 　ＢＥ 　ＴＨＥ 　ＷＯＲＫ 　ＯＦ 　ＡＮ 　ＥＮＥＭＹ 「ＳＴＡＮＤ」！！");
                return;
            }

            // otherwise fire out some brackets and gos

            var shiftCharCode = Δ => c => String.fromCharCode(c.charCodeAt(0) + Δ);
            var outputText = message.text.toUpperCase().replace(/[!-~]/g, shiftCharCode(0xFEE0))
            outputText = " _ゴゴゴ_ 「 " + outputText + " 」 _ゴゴゴ_ ";

            // If we made it here, just echo what the user typed back at them
            slashCommand.replyPublic(message, outputText);
            break;
        case "/clappify": 
            if (message.text === "") {
                slashCommand.replyPublic(message,
                    "Be the :clap: you wish to see in the world.");
                return;
            }
            var outputText = message.text.split(' '). join(' :clap: ');
            slashCommand.replyPublic(message, outputText);
            break;
        default:
            slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + " yet.");

    }
})
;


