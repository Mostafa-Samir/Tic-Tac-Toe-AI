/*
 * Represents a state in the game
 * @param old [State]: old state to intialize the new state
 */
var State = function(old) {

    /*
     * public : the player who has the turn to player
     */
     this.turn = "";

    /*
     * public : the number of moves of the X player
     */
    this.xMovesCount = 0;

    /*
     * public : the number of moves of the O player
     */
     this.oMovesCount = 0;

    /*
     * public : the result of the game in this State
     */
    this.result = "still running";

    /*
     * public : the board configuration in this state
     */
    this.board = [];

    /* Begin Object Construction */
    if(typeof old !== "undefined") {
        // if the state is constructed using a copy of another state
        var len = old.board.length;
        this.board = new Array(len);
        for(var itr = 0 ; itr < len ; itr++) {
            this.board[itr] = old.board[itr];
        }

        this.xMovesCount = old.xMovesCount;
        this.oMovesCount = old.oMovesCount;
        this.result = old.result;
        this.turn = old.turn;
    }
    /* End Object Construction */

    /*
     * public : advances the turn in a the state
     */
    this.advanceTurn = function() {
        this.turn = this.turn === "X" ? "O" : "X";
    }

    /*
     * public function that enumerates the empty cells in a given state
     * @return [Array]: indices of all empty cells
     */
    this.emptyCells = function() {
        var indxs = [];
        for(var itr = 0; itr < 9 ; itr++) {
            if(this.board[itr] === "E") {
                indxs.push(itr);
            }
        }
        return indxs;
    }

    /*
     * public  function that checks if the state is a terminal state or not
     * the state result is updated to reflect the result of the game
     * @returns [bool]: true if it's terminal, false otherwise
     */

    this.isTerminal = function() {
        var board = this.board;

        //check rows
        for(var i = 0; i <= 6; i = i + 3) {
            if(board[i] !== "E" && board[i] === board[i + 1] && board[i + 1] == board[i + 2]) {
                this.result = board[i] + "-won"; //update the state result
                return true;
            }
        }

        //check columns
        for(var i = 0; i <= 2 ; i++) {
            if(board[i] !== "E" && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
                this.result = board[i] + "-won"; //update the state result
                return true;
            }
        }

        //check diagonals
        for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
            if(board[i] !== "E" && board[i] == board[i + j] && board[i + j] === board[i + 2*j]) {
                this.result = board[i] + "-won"; //update the state result
                return true;
            }
        }

        var available = this.emptyCells();
        if(available.length == 0) {
            //the game is draw
            this.result = "draw"; //update the state result
            return true;
        }
        else {
            return false;
        }
    };

};


/*
 * Constructs a game object to be played
 * @param autoPlayer1 [AI] : the first AI player to play the game
 * @param autoPlayer2 [AI] : the second AI player to play the game
 */
var Game = function(autoPlayer1, autoPlayer2) {

    //private attribute: onend callback function
    var onendCall = function(){};

    //initialize the ai player for this game
    this.aiX = autoPlayer1;
    this.aiO = autoPlayer2

    // initialize the game current state to empty board configuration
    this.currentState = new State();

    //"E" stands for empty board cell
    this.currentState.board = ["E", "E", "E",
                               "E", "E", "E",
                               "E", "E", "E"];

    // X plays first
    this.currentState.turn = "X";

    /*
     * initialize game status to beginning
     */
    this.status = "beginning";

    /*
     * public function that advances the game to a new state
     * @param _state [State]: the new state to advance the game to
     */
    this.advanceTo = function(_state) {
        this.currentState = _state;
        if(_state.isTerminal()) {
            this.status = "ended";

            return onendCall(this.currentState);
        }
        else {
            if(this.currentState.turn === "X") {
                this.aiX.notify("X");
            }
            else {
                this.aiO.notify("O");
            }
        }
    };

    /*
     * starts the game
     */
    this.start = function() {
        if(this.status = "beginning") {
            //invoke advanceTo with the intial state
            this.advanceTo(this.currentState);
            this.status = "running";
        }
    }

    /*
     * specify a callback when the game ends
     */
    this.onEnd = function(func) {
        onendCall = func;
    }

};

/*
 * public static function that calculates the score of the x player in a terminal state
 * @param _state [State]: the state in which the score is calculated
 * @return [Number]: the score calculated for the human player
 */
Game.score = function(_state) {
    if(_state.result !== "still running") {
        if(_state.result === "X-won"){
            // the x player won
            return 10 - _state.oMovesCount;
        }
        else if(_state.result === "O-won") {
            //the x player lost
            return -10 + _state.oMovesCount;
        }
        else {
            //it's a draw
            return 0;
        }
    }
}
