var Board = require('board');
var User = require('user');
var Alloy = require('alloy');

if (OS_IOS) {
    // Setup the navigation
    $.index.navBarHidden = true;
    var navWindow = Titanium.UI.iOS.createNavigationWindow({
        window: $.index
    });
    navWindow.open();
}

$.index.addEventListener('click', function(e){
    if (e.source != $.user) {
        // Clicking in the textbox triggers the window click too
        if(OS_ANDROID) {
            Ti.UI.Android.hideSoftKeyboard();
        }
        if(OS_IOS) {
            $.user.blur();
        }
    }
});

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
    $.index.fireEvent('close');
    var playView = Alloy.createController('play').getView();
    playView.index = $.index;
    if (OS_IOS) {
        navWindow.openWindow(playView,
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

var boardInterval;
$.index.addEventListener('open', function() {
    boardInterval = setInterval(function(){
        if (bgBoard.over) {
            startBoard();
        }
        else {
            randomMove();
        }
    }, 1000);
});
$.index.addEventListener('close', function() {
    if (boardInterval) {
        clearInterval(boardInterval);
    }
});
