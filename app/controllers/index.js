$.index.open();

var os = Ti.Platform.osname;
var Board = require('board');
var User = require('user');

function backgroundClick() {
    if(os == "android") {
        Ti.UI.Android.hideSoftKeyboard();
    }
    if(os == "iphone") {
        $.user.blur();
    }
}

function playClick() {
    if ($.user.value == "") {
        $.user.backgroundColor = "#f00";
        var animation = Titanium.UI.createAnimation();
        animation.backgroundColor = "#fff";
        animation.duration = 250;
        $.user.animate(animation);
    }
    User.setUsername($.user.value);
    var playView = Alloy.createController('play').getView();
    clearInterval(boardInterval);
    playView.open();
}

function highscoreClick() {}

var bgBoard = new Board(8, 8, $.index);
var unit = $.index.size.width / (bgBoard.width + 1);
bgBoard.setPosition(unit, 270, unit);
bgBoard.time = 25;

function startBoard() {
    bgBoard.reset();
    bgBoard.addRandom().addLabel();
}

var moves = [bgBoard.up, bgBoard.down, bgBoard.left, bgBoard.right];
function randomMove() {
    moves[Math.floor(Math.random() * 4)].call(bgBoard);
}

var boardInterval = setInterval(function(){
    if (bgBoard.over) {
        startBoard();
    }
    else {
        randomMove();
    }
}, 1000);
