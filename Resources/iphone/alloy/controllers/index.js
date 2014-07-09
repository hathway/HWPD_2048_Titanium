function Controller() {
    function performMove(func) {
        func.call(curBoard);
        curBoard.over && alert("Game over");
        curBoard.print();
        Ti.API.info();
    }
    function doClickUp() {
        performMove(curBoard.up);
    }
    function doClickDown() {
        performMove(curBoard.down);
    }
    function doClickLeft() {
        performMove(curBoard.left);
    }
    function doClickRight() {
        performMove(curBoard.right);
    }
    function doClickReset() {
        curBoard.reset();
        curBoard.addRandom().addLabel();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.upBtn = Ti.UI.createButton({
        top: "35pt",
        width: Ti.UI.SIZE,
        id: "upBtn",
        title: "Up"
    });
    $.__views.index.add($.__views.upBtn);
    doClickUp ? $.__views.upBtn.addEventListener("click", doClickUp) : __defers["$.__views.upBtn!click!doClickUp"] = true;
    $.__views.downBtn = Ti.UI.createButton({
        top: "125pt",
        width: Ti.UI.SIZE,
        id: "downBtn",
        title: "Down"
    });
    $.__views.index.add($.__views.downBtn);
    doClickDown ? $.__views.downBtn.addEventListener("click", doClickDown) : __defers["$.__views.downBtn!click!doClickDown"] = true;
    $.__views.leftBtn = Ti.UI.createButton({
        top: "75pt",
        left: "70pt",
        width: Ti.UI.SIZE,
        id: "leftBtn",
        title: "Left"
    });
    $.__views.index.add($.__views.leftBtn);
    doClickLeft ? $.__views.leftBtn.addEventListener("click", doClickLeft) : __defers["$.__views.leftBtn!click!doClickLeft"] = true;
    $.__views.rightBtn = Ti.UI.createButton({
        top: "75pt",
        right: "70pt",
        width: Ti.UI.SIZE,
        id: "rightBtn",
        title: "Right"
    });
    $.__views.index.add($.__views.rightBtn);
    doClickRight ? $.__views.rightBtn.addEventListener("click", doClickRight) : __defers["$.__views.rightBtn!click!doClickRight"] = true;
    $.__views.resetBtn = Ti.UI.createButton({
        top: "80pt",
        width: Ti.UI.SIZE,
        id: "resetBtn",
        title: "Reset"
    });
    $.__views.index.add($.__views.resetBtn);
    doClickReset ? $.__views.resetBtn.addEventListener("click", doClickReset) : __defers["$.__views.resetBtn!click!doClickReset"] = true;
    $.__views.boardImg = Ti.UI.createImageView({
        id: "boardImg",
        image: "/images/myimage.png"
    });
    $.__views.index.add($.__views.boardImg);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.leftBtn.transform = Ti.UI.create2DMatrix({
        rotate: -90
    });
    $.rightBtn.transform = Ti.UI.create2DMatrix({
        rotate: 90
    });
    $.index.open();
    var Board = require("board");
    var curBoard = new Board(4, 4);
    curBoard.parent = $.index;
    curBoard.addRandom().addLabel();
    __defers["$.__views.upBtn!click!doClickUp"] && $.__views.upBtn.addEventListener("click", doClickUp);
    __defers["$.__views.downBtn!click!doClickDown"] && $.__views.downBtn.addEventListener("click", doClickDown);
    __defers["$.__views.leftBtn!click!doClickLeft"] && $.__views.leftBtn.addEventListener("click", doClickLeft);
    __defers["$.__views.rightBtn!click!doClickRight"] && $.__views.rightBtn.addEventListener("click", doClickRight);
    __defers["$.__views.resetBtn!click!doClickReset"] && $.__views.resetBtn.addEventListener("click", doClickReset);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;