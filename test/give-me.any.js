
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
});