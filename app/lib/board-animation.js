exports.animateBlockTo = animateBlockTo;
exports.animateBlockCombine = animateBlockCombine;
exports.animateAdd = animateAdd;
exports.animateCallback = animateCallback;

var _animateCallback;
var _animateTimeout;
var _animateTimeoutTime = 0;

function animateCallback(callback) {
    if (_animateTimeout) {
        clearAnimateTimeout();
        _animateCallback();
    }
    _animateCallback = callback;
}

function clearAnimateTimeout() {
    if (_animateTimeout) {
        clearTimeout(_animateTimeout);
        _animateTimeout = undefined;
        _animateTimeoutTime = 0;
    }
}

function checkCallback(time) {
    if (time > _animateTimeoutTime) {
        _animateTimeoutTime = time;
        clearAnimateTimeout();
        setTimeout(function(){
            if (_animateCallback) {
                _animateCallback();
            }
        }, _animateTimeoutTime);
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
    //checkCallback(animation.duration);
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
    //checkCallback(animation.duration);

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
