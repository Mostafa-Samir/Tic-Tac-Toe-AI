//import scripts for AI and Game classes
importScripts('ai.js', 'game.js');

var _self = self;

_self.onmessage = runTheGames;

/*
 * run the specified portion of the games
 */
function runTheGames(msg) {
    //create the two ai players
    var xPlayer = new AI(msg.data.xlevel);
    var oPlayer = new AI(msg.data.olevel);

    xPlayer.noviceOptimalRatio = 1;

    for(var count = 0; count < 333 + msg.data.runOneMoreIteration; count++) {

        //create and configure a game
        var game = new Game(xPlayer, oPlayer);
        xPlayer.plays(game);
        oPlayer.plays(game);

        game.onEnd(function(final) {
            var obj = {
                result : final.result,
                xMovesCount: final.xMovesCount
            };

            //when a game ends send to the main thread info about the final state for bookkeeping
            _self.postMessage(obj);
        });

        //start a game
        game.start();
    }
}
