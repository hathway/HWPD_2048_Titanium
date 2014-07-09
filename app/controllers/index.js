function performMove(func) {
    func.call(curBoard);
    if(curBoard.over) {
        alert('Game over');
    }
    curBoard.print();
    Ti.API.info();
}

function doClickUp() {performMove(curBoard.up);}
function doClickDown() {performMove(curBoard.down);}
function doClickLeft() {performMove(curBoard.left);}
function doClickRight() {performMove(curBoard.right);}
function doClickReset() {curBoard.reset();curBoard.addRandom().addLabel();}

$.leftBtn.transform = Ti.UI.create2DMatrix({rotate: -90});
$.rightBtn.transform = Ti.UI.create2DMatrix({rotate: 90});

$.index.open();

var Board = require('board');

var curBoard = new Board(4, 4);
curBoard.parent = $.index;
curBoard.addRandom().addLabel();


//var tests = require('tests');
//tests.run();
