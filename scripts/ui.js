/*
 * ui object encloses all UI related methods and attributes
 */
var ui = {};

//holds the state of the intial controls visibility
ui.intialControlsVisible = true;

//holds the setInterval handle for the robot flickering
ui.robotFlickeringHandle = 0;

//holds the current visible view
ui.currentView = "";

/*
 * starts the flickering effect of the robot image
 */
ui.startRobotFlickering = function() {
    ui.robotFlickeringHandle = setInterval(function() {
        $("#robot").toggleClass('robot');
    }, 500);
};

/*
 * stops the flickering effect on the robot image
 */
ui.stopRobotFlickering = function() {
    clearInterval(ui.robotFlickeringHandle);
};

/*
 * switchs the view on the UI depending on who's turn it switchs
 * @param turn [String]: the player to switch the view to
 */
ui.switchViewTo = function(turn) {

    //helper function for async calling
    function _switch(_turn) {
        ui.currentView = "#" + _turn;
        $(ui.currentView).fadeIn("fast");

        if(_turn === "ai")
            ui.startRobotFlickering();
    }

    if(ui.intialControlsVisible) {
        //if the game is just starting
        ui.intialControlsVisible = false;

        $('.intial').fadeOut({
            duration : "slow",
            done : function() {
                _switch(turn);
            }
        });
    }
    else {
        //if the game is in an intermediate state
        $(ui.currentView).fadeOut({
            duration: "fast",
            done: function() {
                _switch(turn);
            }
        });
    }
};

/*
 * updates score table
 * @param _status [String]: the last round winner
 */
ui.updateScore = function(_status) {
    if (_status === "X-won") {
        $('.human-score').text(parseInt($('.human-score').text()) + 1);
    } else if (_status === "O-won") {
        $('.robot-score').text(parseInt($('.robot-score').text()) + 1);
    }
}

/*
 * restarts board
 */
ui.restartGame = function(newGame) {
    var board = $('.cell');

    board.fadeOut(1200);
    setTimeout(function() { board.text("");  }, 620);
    board.fadeIn(function() {
        $(board).removeClass('occupied');
        $(board).addClass('undefined');
        newGame.start(); }
        );
}

/*
 * places X or O in the specifed place in the board
 * @param i [Number] : row number (0-indexed)
 * @param j [Number] : column number (0-indexed)
 * @param symbol [String]: X or O
 */
ui.insertAt = function(indx, symbol) {
    var board = $('.cell');
    var targetCell = $(board[indx]);

    if(!targetCell.hasClass('occupied')) {
        targetCell.html(symbol);
        targetCell.css({
            color : symbol == "X" ? "green" : "red"
        });
        targetCell.addClass('occupied');
    }
}
