exports.animateBlockTo = animateBlockTo;
exports.animateBlockCombine = animateBlockCombine;
exports.animateAdd = animateAdd;
exports.animateCallback = animateCallback;

var _animationTimeout;
var _animationTime = 0;
var _animationCallback;

function animateCallback(callback) {
    // Set a timer to call callback soon
    if (_animationCallback) {
        // There is already a pending callback, call it

        _animationCallback();
    }
    _animationCallback = callback;
    if (_animationTimeout) {
        clearTimeout(_animationTimeout);
    }
    _animationTimeout = setTimeout(function(){
        if (_animationCallback) {
            _animationCallback();
        }
        _animationCallback = undefined;
        _animationTimeout = undefined;
        _animationTime = 0;
    }, _animationTime);
    _animationTime = 0;
}

function updateTime(delay) {
    if (delay > _animationTime) {
        _animationTime = delay;
    }
}

function animateBlockTo(block, x, y) {
    if(!block.label) {
        Ti.API.error('Cannot animate a block without a label')
        return
    }
    block.updateLabel();
    var animation = Titanium.UI.createAnimation();
    animation.top = block.transformY(y);
    animation.left = block.transformX(x);
    animation.duration = (Math.abs(block.x - x) + Math.abs(block.y - y)) * block.board.time;
    animation.curve = Ti.UI.ANIMATION_CURVE_LINEAR;
    updateTime(animation.duration);
    block.label.animate(animation);
}

function animateBlockCombine(block, otherBlock) {
    if(!block.label) {
        Ti.API.error('Cannot animate a block without a label')
        return
    }
    block.updateLabel();
    var animation = Titanium.UI.createAnimation();
    animation.top = block.transformY(otherBlock.y);
    animation.left = block.transformX(otherBlock.x);
    animation.duration = (Math.abs(block.x - otherBlock.x) + Math.abs(block.y - otherBlock.y)) * block.board.time;
    animation.curve = Ti.UI.ANIMATION_CURVE_LINEAR;
    updateTime(animation.duration);

    animation.addEventListener('complete', function(){
        otherBlock.updateLabel();
        block.board.parent.remove(block.label);
    });
    block.label.animate(animation);
}

function animateAdd(block) {
    if(!block.label) {
        Ti.API.error('Cannot animate a block without a label')
        return
    }
    block.label.opacity = 0;
    var animation = Titanium.UI.createAnimation();
    animation.opacity = 1;
    animation.duration = block.board.time;
    block.label.animate(animation);
}
