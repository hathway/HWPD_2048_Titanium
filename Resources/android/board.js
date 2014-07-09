function Block(board, x, y, value) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.blocks = board.blocks;
    null != this.blocks[x][y] && Ti.API.error("Cannot add block, position occupied");
    this.value = value;
    this.label = void 0;
}

function Board(w, h, parent) {
    if (void 0 == w || void 0 == h) {
        Ti.API.error("w and h are required parameters for Board");
        return;
    }
    this.width = w;
    this.height = h;
    this.TOP_ROW = [];
    this.RIGHT_ROW = [];
    this.BOTTOM_ROW = [];
    this.LEFT_ROW = [];
    for (var x = 0; w > x; x += 1) {
        this.TOP_ROW.push([ x, 0 ]);
        this.BOTTOM_ROW.push([ x, h - 1 ]);
    }
    for (var y = 0; h > y; y += 1) {
        this.LEFT_ROW.push([ 0, y ]);
        this.RIGHT_ROW.push([ w - 1, y ]);
    }
    this.blocks = {};
    this.score = 0;
    this.over = false;
    this.parent = parent;
    this.reset();
}

var displayWidth = Ti.Platform.displayCaps.platformWidth;

var boardAnimation = require("board-animation");

var animateBlockTo = boardAnimation.animateBlockTo;

var animateBlockCombine = boardAnimation.animateBlockCombine;

var animateAdd = boardAnimation.animateAdd;

Block.prototype.addLabel = function() {
    this.label = Ti.UI.createLabel({
        textAlign: "center"
    });
    this.board.parent.add(this.label);
    this.updateLabel();
};

Block.prototype.transformY = function(y) {
    return 235 + displayWidth / 4 * y + "pt";
};

Block.prototype.transformX = function(x) {
    return 35 + displayWidth / 4 * x + "pt";
};

Block.prototype.updateLabel = function() {
    if (void 0 != this.label) {
        this.label.top = this.transformY(this.y);
        this.label.left = this.transformX(this.x);
        this.label.text = this.value;
    }
};

Block.prototype.moveTo = function(pos) {
    var newX = pos[0], newY = pos[1];
    this.blocks[this.x][this.y] = null;
    animateBlockTo(this, newX, newY);
    this.x = newX;
    this.y = newY;
    this.blocks[this.x][this.y] = this;
};

Block.prototype.combineWith = function(block) {
    block.value += this.value;
    animateBlockCombine(this, block);
    this.blocks[this.x][this.y] = null;
};

Block.prototype.destroy = function() {
    void 0 != this.label && this.board.parent.remove(this.label);
    this.blocks[this.x][this.y] = null;
};

Board.prototype.reset = function() {
    var block;
    this.score = 0;
    this.over = false;
    for (var x = 0; this.width > x; x += 1) {
        void 0 == this.blocks[x] && (this.blocks[x] = {});
        for (var y = 0; this.height > y; y += 1) {
            block = this.blocks[x][y];
            null != block && block.destroy();
            this.blocks[x][y] = null;
        }
    }
};

Board.prototype.addRandom = function() {
    var empties = [];
    var choices = [ 2, 4 ];
    for (var x = 0; this.width > x; x += 1) for (var y = 0; this.height > y; y += 1) {
        block = this.blocks[x][y];
        null == block && empties.push([ x, y ]);
    }
    if (0 == empties.length) return false;
    var coords = empties[Math.floor(Math.random() * empties.length)];
    var value = choices[Math.floor(Math.random() * choices.length)];
    return this.add(coords[0], coords[1], value);
};

Board.prototype.add = function(x, y, value) {
    (0 > x || x >= this.width || 0 > y || y >= this.height) && Ti.API.error("[Board] " + x + ", " + y + " is out of range");
    var block = new Block(this, x, y, value);
    this.blocks[x][y] = block;
    return block;
};

Board.prototype.print = function() {
    var line, val;
    for (var y = 0; this.height > y; y += 1) {
        line = "";
        for (var x = 0; this.width > x; x += 1) {
            if (null != this.blocks[x][y]) {
                val = "" + this.blocks[x][y].value;
                while (3 > val.length) val = " " + val;
            } else val = "   ";
            line += val;
            this.width - 1 > x && (line += "|");
        }
        Ti.API.info(line);
    }
};

Board.prototype.move = function(row, direction) {
    if (this.over) return;
    var madeMove = this.scan(row, direction);
    if (madeMove) {
        var block = this.addRandom();
        block.addLabel();
        animateAdd(block);
    }
    this.canMove() || (this.over = true);
};

Board.prototype.canMove = function() {
    return this.scan(this.TOP_ROW, this.DOWN, true) || this.scan(this.BOTTOM_ROW, this.UP, true) || this.scan(this.LEFT_ROW, this.RIGHT, true) || this.scan(this.RIGHT_ROW, this.LEFT, true);
};

Board.prototype.UP = [ 0, -1 ];

Board.prototype.RIGHT = [ 1, 0 ];

Board.prototype.DOWN = [ 0, 1 ];

Board.prototype.LEFT = [ -1, 0 ];

Board.prototype.scan = function(row, direction, testOnly) {
    var madeMove = false;
    var incX = direction[0], incY = direction[1];
    var x, y, block;
    var nullPos = void 0;
    var blockObj = void 0;
    for (var i = 0; row.length > i; i += 1) {
        x = row[i][0];
        y = row[i][1];
        while (x >= 0 && y >= 0 && this.width > x && this.height > y) {
            block = this.blocks[x][y];
            if (null != block) if (void 0 != blockObj && block.value == blockObj.value) {
                if (testOnly) return true;
                madeMove = true;
                block.combineWith(blockObj);
                this.score += blockObj.value;
                nullPos = [ blockObj.x + incX, blockObj.y + incY ];
                blockObj = void 0;
            } else if (void 0 != nullPos) {
                if (testOnly) return true;
                madeMove = true;
                block.moveTo(nullPos);
                blockObj = block;
                nullPos = [ blockObj.x + incX, blockObj.y + incY ];
            } else blockObj = block; else void 0 == nullPos && (nullPos = [ x, y ]);
            x += incX;
            y += incY;
        }
        nullPos = void 0;
        blockObj = void 0;
    }
    if (testOnly) return false;
    return madeMove;
};

Board.prototype.up = function() {
    this.move(this.TOP_ROW, this.DOWN);
};

Board.prototype.down = function() {
    this.move(this.BOTTOM_ROW, this.UP);
};

Board.prototype.left = function() {
    this.move(this.LEFT_ROW, this.RIGHT);
};

Board.prototype.right = function() {
    this.move(this.RIGHT_ROW, this.LEFT);
};

module.exports = Board;