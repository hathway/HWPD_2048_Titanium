function animateBlockTo(block, x, y) {
    if (!block.label) {
        Ti.API.error("Cannot animate a block without a label");
        return;
    }
    block.updateLabel();
    var animation = Titanium.UI.createAnimation();
    animation.top = block.transformY(y);
    animation.left = block.transformX(x);
    animation.duration = (Math.abs(block.x - x) + Math.abs(block.y - y)) * BLOCK_TIME;
    block.label.animate(animation);
}

function animateBlockCombine(block, otherBlock) {
    if (!block.label) {
        Ti.API.error("Cannot animate a block without a label");
        return;
    }
    block.updateLabel();
    var animation = Titanium.UI.createAnimation();
    animation.top = block.transformY(otherBlock.y);
    animation.left = block.transformX(otherBlock.x);
    animation.duration = (Math.abs(block.x - otherBlock.x) + Math.abs(block.y - otherBlock.y)) * BLOCK_TIME;
    animation.addEventListener("complete", function() {
        otherBlock.updateLabel();
        block.board.parent.remove(block.label);
    });
    block.label.animate(animation);
}

function animateAdd(block) {
    if (!block.label) {
        Ti.API.error("Cannot animate a block without a label");
        return;
    }
    block.label.opacity = 0;
    setTimeout(function() {
        var animation = Titanium.UI.createAnimation();
        animation.opacity = 1;
        animation.duration = BLOCK_TIME;
        block.label.animate(animation);
    }, BLOCK_TIME * Math.max(block.board.width, block.board.height));
}

exports.animateBlockTo = animateBlockTo;

exports.animateBlockCombine = animateBlockCombine;

exports.animateAdd = animateAdd;

var BLOCK_TIME = 100;