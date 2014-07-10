var boardAnimation = require('board-animation');
var animateBlockTo = boardAnimation.animateBlockTo;
var animateBlockCombine = boardAnimation.animateBlockCombine;
var animateAdd = boardAnimation.animateAdd;
var animateCallback = boardAnimation.animateCallback;

function Block(board, x, y, value) {
    this.x = x; this.y = y;
    this.board = board;
    this.blocks = board.blocks;
    if (this.blocks[x][y] != null) {
        Ti.API.error('Cannot add block, position occupied');
    }
    this.value = value;
    this.label = undefined;
}

Block.prototype.addLabel = function() {
    this.label = Ti.UI.createLabel({
        font: {
            textAlign: 'center'
        }
    });
    this.board.parent.add(this.label);
    this.updateLabel();
};

Block.prototype.transformY = function(y) {
    return this.board.y + (y * this.board.unit) + "pt";
};

Block.prototype.transformX = function(x) {
    return this.board.x + (x * this.board.unit) + "pt";
};

Block.prototype.updateLabel = function() {
    if (this.label != undefined) {
        this.label.opacity = 1;
        this.label.top = this.transformY(this.y);
        this.label.left = this.transformX(this.x);
        this.label.text = this.value;
    }
};

Block.prototype.moveTo = function(pos) {
    var newX = pos[0], newY = pos[1];
    // Move this block to that position, and update blocks
    this.blocks[this.x][this.y] = null;
    animateBlockTo(this, newX, newY);
    this.x = newX;
    this.y = newY;
    this.blocks[this.x][this.y] = this;
};

Block.prototype.combineWith = function(block) {
    block.value += this.value;
    animateBlockCombine(this, block);
    this.blocks[this.x][this.y] = null
};

Block.prototype.destroy = function() {
    if (this.label != undefined) {
        this.board.parent.remove(this.label);
    }
    this.blocks[this.x][this.y] = null
};

// 2048 board structure
function Board(w, h, parent) {
    // Rows contain a list of the coordinates of that row
    if (w == undefined || h == undefined) {
        Ti.API.error('w and h are required parameters for Board');
        return
    }
    this.width = w;
    this.height = h;
    this.TOP_ROW = [];
    this.RIGHT_ROW = [];
    this.BOTTOM_ROW = [];
    this.LEFT_ROW = [];
    for(var x = 0; x < w; x += 1) {
        this.TOP_ROW.push([x, 0]);
        this.BOTTOM_ROW.push([x, h - 1]);
    }
    for(var y = 0; y < h; y += 1) {
        this.LEFT_ROW.push([0, y]);
        this.RIGHT_ROW.push([w - 1, y]);
    }
    this.blocks = {};
    this.score = 0;
    this.over = false;
    this.top = 0;
    this.parent = parent;
    this.unit = 5;
    this.x = 0;
    this.y = 0;
    this.time = 100;
    this.reset();
}

Board.prototype.setPosition = function(x, y, width) {
    this.x = x;
    this.y = y;
    this.unit = width;
};

Board.prototype.reset = function() {
    var block;
    this.score = 0;
    this.over = false;
    for(var x = 0; x < this.width; x += 1) {
        if(this.blocks[x] == undefined) {
            this.blocks[x] = {};
        }
        for(var y = 0; y < this.height; y += 1) {
            block = this.blocks[x][y];
            if(block != null) {
                block.destroy();
            }
            this.blocks[x][y] = null;
        }
    }
};

Board.prototype.addRandom = function() {
    var empties = [];
    var choices = [2, 4];
    for(var x = 0; x < this.width; x += 1) {
        for(var y = 0; y < this.height; y += 1) {
            var block = this.blocks[x][y];
            if(block == null) {
                empties.push([x, y]);
            }
        }
    }
    if (empties.length == 0) {
        return false
    }
    var coords = empties[Math.floor(Math.random() * empties.length)];
    var value = choices[Math.floor(Math.random() * choices.length)];
    return this.add(coords[0], coords[1], value);
};

Board.prototype.add = function(x, y, value) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        Ti.API.error('[Board] ' + x + ', ' + y + ' is out of range');
    }
    var block = new Block(this, x, y, value);
    this.blocks[x][y] = block;
    return block;
};

Board.prototype.print = function() {
    var line, val;
    for(var y = 0; y < this.height; y += 1) {
        line = "";
        for(var x = 0; x < this.width; x += 1) {
            if(this.blocks[x][y] != null) {
                val = "" + this.blocks[x][y].value;
                while(val.length < 3) {
                    val = " " + val;
                }
            }
            else {
                val = "   ";
            }
            line += val;
            if(x < this.width - 1) {
                line += "|"
            }
        }
        Ti.API.info(line);
    }
};

Board.prototype.move = function(row, direction) {
    if (this.over) {
        return;
    }
    var madeMove = this.scan(row, direction);
    // Only add a rando if something happened
    if (madeMove) {
        var block = this.addRandom();
        block.addLabel();
        block.label.opacity = 0;

        animateCallback(function(){
            animateAdd(block);
        });
    }

    if (!this.canMove()) {
        this.over = true;
    }
};

Board.prototype.canMove = function() {
    return this.scan(this.TOP_ROW,    this.DOWN,  true) ||
           this.scan(this.BOTTOM_ROW, this.UP,    true) ||
           this.scan(this.LEFT_ROW,   this.RIGHT, true) ||
           this.scan(this.RIGHT_ROW,  this.LEFT,  true);
};

// constants
// Starting from TOP_ROW [x, y], [...] and adding DOWN[x, y] to each you will iterate over all blocks downward
// direction
Board.prototype.UP    = [0, -1];
Board.prototype.RIGHT = [1,  0];
Board.prototype.DOWN  = [0,  1];
Board.prototype.LEFT  = [-1, 0];

Board.prototype.scan = function(row, direction, testOnly) {
    // scan starts on the opposite side of the move and scans back, moving and combining blocks
    // ex: If "right" is hit then row = RIGHT_ROW, direction = LEFT, and the function iterates from the right to
    // the left, and rowwards is rightwards.
    var madeMove = false;
    var incX = direction[0], incY = direction[1];
    var x, y, block;
    // These record the furthest rowwards block and null
    var nullPos = undefined;
    var blockObj = undefined;
    for(var i=0; i < row.length; i += 1) { // Iterate over all coordinates in the most rowwards row.
        x = row[i][0]; y = row[i][1];
        while (x >= 0 && y >= 0 && x < this.width && y < this.height) { // Iterate over the row
            //console.log('Block: ', x, y);
            block = this.blocks[x][y];
            if (block != null) {
                if(blockObj != undefined && block.value == blockObj.value) {
                    // There is a block rowwards that should be combined with
                    if (testOnly) {
                        return true;
                    }
                    madeMove = true;

                    block.combineWith(blockObj); // combine them
                    this.score += blockObj.value;

                    // The position just before block is known to be null (or is off bounds and won't be iterated to)
                    nullPos = [blockObj.x + incX, blockObj.y + incY];
                    // blockObj can no longer be combined with, so it must be forgotten
                    blockObj = undefined;
                }
                else { // block not null and nothing to combine with
                    if(nullPos != undefined) { // There is an empty block to move to
                        //console.log('Moving to', nullPos)
                        if (testOnly) {
                            return true;
                        }
                        madeMove = true;
                        block.moveTo(nullPos); // Move the block

                        blockObj = block; // This is now the furthest block rowwards
                        nullPos = [blockObj.x + incX, blockObj.y + incY];
                    }
                    else {
                        // No empty spaces to move to, so just store this as the most rowwards block
                        blockObj = block;
                    }
                }
            } else if(nullPos == undefined) { // block == null
                // If no null has been found then record the empty spot
                nullPos = [x, y];
            }
            x += incX; y += incY; // This takes a step in direction, which is anti-rowwards
        }
        nullPos = undefined;
        blockObj = undefined;
    }
    if (testOnly) {
        return false;
    }
    return madeMove;
};

// Helpers
Board.prototype.up    = function(){this.move(this.TOP_ROW,    this.DOWN);};
Board.prototype.down  = function(){this.move(this.BOTTOM_ROW, this.UP);};
Board.prototype.left  = function(){this.move(this.LEFT_ROW,   this.RIGHT);};
Board.prototype.right = function(){this.move(this.RIGHT_ROW,  this.LEFT);};

module.exports = Board;