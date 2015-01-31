/*
 * ui object encloses all UI related methods and attributes
 */
var ui = {};

/*
 * updates the ui fields that corresponds to the records being booked during the test
 * @param final [Objcet]: the final state of the ended game
 */
ui.updateRecords = function(final) {
    $("#count").text(parseInt($("#count").text()) + 1);
    if(final.result === "X-won") {
        $("#wonCount").text(parseInt($("#wonCount").text()) + 1);
        switch(final.xMovesCount) {
            case 3: $("#won3").text(parseInt($("#won3").text()) + 1); break;
            case 4: $("#won4").text(parseInt($("#won4").text()) + 1); break;
            case 5: $("#won5").text(parseInt($("#won5").text()) + 1); break;
        }
    }
    else if(final.result === "O-won") {
        $("#lostCount").text(parseInt($("#lostCount").text()) + 1);
    }
    else {
        $("#drawCount").text(parseInt($("#drawCount").text()) + 1);
    }

    if(parseInt($("#count").text()) === 1000) {
        $(".start").text("Start Playing");
        flags.areGamesRunning = false;
    }
};

/*
 * reset the all records to 0
 */
ui.resetRecords = function() {
    $("#count").text(0);
    $("#wonCount").text(0);
    $("#won3").text(0);
    $("#won4").text(0);
    $("#won5").text(0);
    $("#drawCount").text(0);
    $("#lostCount").text(0);
};


