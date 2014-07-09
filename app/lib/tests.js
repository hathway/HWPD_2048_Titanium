exports.run = function(){mocha.run()};

require('ti-mocha');
var should = require('should');
var Board = require('board');

describe('all tests', function(){
    describe('board', function(){
        it('should instantiate into a null array', function(){
            var board = new Board(1, 1);
            board.print();
            board.blocks.should.eql({'0':{'0':null}});
        });
        it('should be able to add blocks', function(){
            var board = new Board(1, 1);
            board.add(0, 0, 2);
            board.print();
            board.blocks[0][0].value.should.eql(2);
        });
        it('should let blocks fall right', function(){
            var board = new Board(2, 2);
            board.add(0, 0, 2);
            board.add(0, 1, 4);
            board.print();
            board.right();
            console.log('-->');
            board.print();
            board.blocks[1][0].value.should.eql(2);
            board.blocks[1][1].value.should.eql(4);
        });
        it('shouldnt let different blocks stack', function(){
            var board = new Board(2, 1);
            board.add(0, 0, 2);
            board.add(1, 0, 4);
            board.print();
            board.left();
            console.log('<--');
            board.print();
            board.blocks[0][0].value.should.eql(2);
            board.blocks[1][0].value.should.eql(4);
        });
        it('should let similar blocks stack', function(){
            var board = new Board(2, 1);
            board.add(0, 0, 2);
            board.add(1, 0, 2);
            board.print();
            board.left();
            console.log('<--');
            board.print();
            board.blocks[0][0].value.should.eql(4);
            should(board.blocks[1][0]).eql(null);
            board.score.should.eql(4);
        });
        it('should let multiple shift', function(){
            var board = new Board(4, 1);
            board.add(0, 0, 2);
            board.add(1, 0, 4);
            board.add(2, 0, 8);
            board.print();
            board.right();
            console.log('-->');
            board.print();
            should(board.blocks[0][0]).eql(null);
            board.blocks[1][0].value.should.eql(2);
            board.blocks[2][0].value.should.eql(4);
            board.blocks[3][0].value.should.eql(8);
        });
        it('should let multiple combine even with accessories', function(){
            var board = new Board(5, 1);
            board.add(0, 0, 4);
            board.add(1, 0, 2);
            board.add(2, 0, 2);
            board.add(3, 0, 4);
            board.print();
            board.right();
            console.log('-->');
            board.print();
            should(board.blocks[0][0]).eql(null);
            should(board.blocks[1][0]).eql(null);
            board.blocks[2][0].value.should.eql(4);
            board.blocks[3][0].value.should.eql(4);
            board.blocks[4][0].value.should.eql(4);
            board.score.should.eql(4);
        });
        it('should allow complex maneuvers', function(){
           var board = new Board(3, 3);
            board.add(0, 0, 2);
            board.add(0, 2, 2);
            board.add(1, 2, 4);
            board.add(2, 0, 8);
            board.add(2, 2, 16);
            board.print();
            board.up();
            board.score.should.equal(4);
            console.log('^   s: 4');
            board.print();
            board.right();
            board.score.should.equal(4 + 8);
            console.log('--> s: 12');
            board.print();
            board.right();
            board.score.should.equal(4 + 8 + 16);
            console.log('--> s: 28');
            board.print();
            board.down();
            board.score.should.equal(4 + 8 + 16 + 32);
            console.log('V   s: 60');
            board.print();
            board.blocks[2][2].value.should.eql(32);
        });
    });
});
