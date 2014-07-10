var Board = require('board');
var User = require('user');
var Alloy = require('alloy');

if (OS_IOS) {
    // Setup the navigation
    var navWindow = Titanium.UI.iOS.createNavigationWindow({
        window: $.index
    });
    navWindow.open();
}

function backgroundClick() {
    if(OS_ANDROID) {
        Ti.UI.Android.hideSoftKeyboard();
    }
    if(OS_IOS) {
        $.user.blur();
    }
}

function playClick() {
    if ($.user.value == "") {
        $.user.backgroundColor = "#f00";
        var animation = Ti.UI.createAnimation();
        animation.backgroundColor = "#fff";
        animation.duration = 250;
        $.user.animate(animation);
        return;
    }
    User.setUsername($.user.value);
    clearInterval(boardInterval);
    if (OS_IOS) {
        navWindow.openWindow(Alloy.createController('play').getView(),
            {transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
    }
}

function highscoreClick() {}

var bgBoard = new Board(8, 8, $.index);
var unit = $.index.size.width / (bgBoard.width + 1);
bgBoard.setPosition(unit, 270, unit);
bgBoard.time = 50;
startBoard();

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
}, 250);
