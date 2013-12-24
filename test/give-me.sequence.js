var should = require('should');

var giveMe = require('./../index');
var _ = require('./../lib/utils');

describe('The GiveMe.sequence function', function(){

  it('should execute a function with different parameters', function(done){

    var fn = function(timeout, callback){ 
      setTimeout(function() {
        callback(parseInt(timeout, 10) + 1);
      }, timeout);
    };

    giveMe.sequence(fn, [[1], [2], [5]], function(callbacks){
      callbacks.should.be.eql([[2], [3], [6]]);
      done();
    });
  });

  it('should execute the function in sequence', function(done){

    var fn = function(timeout, callback){ 
      setTimeout(function() {
        callback();
      }, timeout);
    };

    var start = new Date();

    giveMe.sequence(fn, [[10], [20], [30]], function(callbacks){
      var newTime = new Date() - start;
      newTime.should.be.within(60, 66);
      done();
    });
  });

  it('should execute the functions with multiple parameters if needed', function(done){

    var fn = function(timeout1, timeout2, callback){ 
      var timeout = parseInt(timeout1, 10) + parseInt(timeout2, 10);

      setTimeout(function() {
        callback(timeout);
      }, timeout);
    };

    giveMe.sequence(fn, [[1,2], [2,3], [3,4]], function(callbacks){
      callbacks.should.be.eql([[3], [5], [7]]);
      done();
    });
      
  });

  it('should execute one functions without parameters', function(done){

    var fn = function(callback){ 
      setTimeout(function() {
        callback('hello');
      }, 10);
    };

    giveMe.sequence([fn], function(callbacks){
      callbacks.should.be.eql([['hello']]);
      done();
    });      
  });

  it('should execute one functions with a binded context', function(done){

    var MyClass = function(sentence){
      this.sentence = sentence;

      this.hello = function(name, callback){
        callback(this.sentence + ' ' + name);
      };
    };

    var myClassIstance = new MyClass('My name is'),
        parameters = [['Micky Mouse'], ['Donald Duck']];

    giveMe.sequence(_.bind(myClassIstance.hello, myClassIstance), parameters, function(callbacks){
      callbacks.should.be.eql([['My name is Micky Mouse'], ['My name is Donald Duck']]);
      done();
    });      
  });

});