/*
 * object that holds the configurations of the games to be played
 */
var configs = {
    xlevel : "",
    olevel : "",
    runOneMoreIteration: 0
};

/*
 * object containing flags for events control
 */
var flags = {
    areGamesRunning: false
};

/*
 * click event handler for the the dropdown menu selection area
 */
$(".dropdown-menu .selection").click(function(){
    if(!flags.areGamesRunning) {
        //open|close the dropdown menu
        $(".dropdown-menu .items").slideToggle();
    }
});

/*
 * click event handlers for each item in the dropdown menu
 */
$(".dropdown-menu .items h1").each(function(){
    var $this = $(this);
    $this.click(function(){
        //change the selection arae text with the selected item
        $(".dropdown-menu .selection h1").text($this.text());
        $(".dropdown-menu .selection").css("opacity", 1);

        //set the configs object based on the attributes read from the selected item
        configs.xlevel = $this.data('xlevel');
        configs.olevel = $this.data('olevel');

        $(".dropdown-menu .items").slideToggle();
    });
});

$(".start").click(function(){
    if(!flags.areGamesRunning && configs.xlevel !== "") {
        ui.resetRecords();

        //create parallel workers to play the 1000 games
        var games = [
            new Worker('./scripts/third.of.games.js'),
            new Worker('./scripts/third.of.games.js'),
            new Worker('./scripts/third.of.games.js')
        ];

        var counter = 1;
        configs.runOneMoreIteration = 0; //reset

        games.forEach(function(portion) {
            portion.onmessage = function(msg) {
                //update the records with info from the ended game
                ui.updateRecords(msg.data);
            };

            //start the parallel worker with the specified configurations
            if(counter === 3){
                configs.runOneMoreIteration = 1;
            }
            portion.postMessage(configs);

            counter++;
        });

        flags.areGamesRunning = true;

        $(".start").text("Running ...");
    }

});