var should = require('should');

var giveMe = require('./../index');

describe('The GiveMe.any function', function(){
  it('should retrieve the faster callback', function(done) {
  
    var a = function(callback){ setTimeout((function(){ callback("a") }), 20); }
    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); }

    var time = new Date();

    giveMe.any([a, b], function(result){
      var now = new Date() - time;

      result.should.be.eql(["[Not processed yet]",["b"]]);
      now.should.be.within(9, 12);
      done();
    });
  });

  it('should work with the \'first\' alias as well', function(done) {
  
    var a = function(callback){ setTimeout((function(){ callback("a") }), 20); }
    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); }

    giveMe.first([a, b], function(result){
      result.should.be.eql(["[Not processed yet]",["b"]]);
      done();
    });
  });

  it('should work with a conditional optional function', function(done) {
  
    var a = function(param, callback){ setTimeout((function(){ callback(param + 10) }), 30); }
    var b = function(param, callback){ setTimeout((function(){ callback(param + 20) }), 10); }
    var c = function(param, callback){ setTimeout((function(){ callback(param + 30) }), 20); }

    giveMe.any([a, b, c], [-10, 0, -30], function(functionResult){
      return functionResult == 0;
    }, function(result){
      result.should.be.eql(["[Not processed yet]",[20], [0]]);
      done();
    });
  });

  it('should accept a single parameter as function if I need to execute it one time', function(done) {
  
    var f = function(param, delay, callback){ setTimeout((function(){ callback(param) }), delay); }

    giveMe.any(f, [["a", 20]], function(result){
      result.should.be.eql([["a"]]);
      done();
    });
  });

  it('should do the callback after processing all the functions if the requirement is not satisfied by anyone', function(done) {
  
    var a = function(param, callback){ setTimeout((function(){ callback(param) }), 30); }
    var b = function(param, callback){ setTimeout((function(){ callback(param) }), 10); }
    var c = function(param, callback){ setTimeout((function(){ callback(param) }), 20); }

    giveMe.any([a, b, c], [false, false, false], function(functionResult){
      return functionResult == true;
    }, function(result){
      result.should.be.eql([[false], [false], [false]]);
      done();
    });
  });

  it('should accept a single parameter as function if the same is executed with multiple arguments', function(done) {
  
    var f = function(param, delay, callback){ setTimeout((function(){ callback(param) }), delay); }

    giveMe.any(f, [["a", 20] , ["b", 10]], function(result){
      result.should.be.eql(["[Not processed yet]", ["b"]]);
      done();
    });
  });
});