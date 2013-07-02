
var should = require('should');

var giveMe = require('./../index');

describe('The GiveMe.any function', function(){
  it('should retrieve the faster callback', function(done) {
  
    var a = function(callback){ setTimeout((function(){ callback("a") }), 2000); }
    var b = function(callback){ setTimeout((function(){ callback("b") }), 100); }

    giveMe.any([a, b], function(result){
      result.should.be.eql(["[Not processed yet]",["b"]]);
      done();
    });
  });

  it('should work with the \'first\' alias as well', function(done) {
  
    var a = function(callback){ setTimeout((function(){ callback("a") }), 2000); }
    var b = function(callback){ setTimeout((function(){ callback("b") }), 100); }

    giveMe.first([a, b], function(result){
      result.should.be.eql(["[Not processed yet]",["b"]]);
      done();
    });
  });

  it('should work with a conditional optional function', function(done) {
  
    var a = function(param, callback){ setTimeout((function(){ callback(param + 10) }), 200); }
    var b = function(param, callback){ setTimeout((function(){ callback(param + 20) }), 50); }
    var c = function(param, callback){ setTimeout((function(){ callback(param + 30) }), 100); }

    giveMe.any([a, b, c], [-10, 0, -30], function(functionResult){
      return functionResult == 0;
    }, function(result){
      result.should.be.eql(["[Not processed yet]",[20], [0]]);
      done();
    });
  });

  it('should do the callback after processing all the functions if the requirement is not satisfied by anyone', function(done) {
  
    var a = function(param, callback){ setTimeout((function(){ callback(param) }), 200); }
    var b = function(param, callback){ setTimeout((function(){ callback(param) }), 50); }
    var c = function(param, callback){ setTimeout((function(){ callback(param) }), 100); }

    giveMe.any([a, b, c], [false, false, false], function(functionResult){
      return functionResult == true;
    }, function(result){
      result.should.be.eql([[false], [false], [false]]);
      done();
    });
  });
});