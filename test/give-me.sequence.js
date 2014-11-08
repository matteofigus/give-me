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

  describe('when tuple-callback used', function(){

    var errorFunc = function(callback){ setTimeout(function() { callback('an error'); }, 10); };
    var successFunc = function(callback){ setTimeout(function() { callback(null, 'hello'); }, 10); };

    var emptyFunc = function(callback){ setTimeout(function() { callback(); }, 10); };
    var nullFunc = function(callback){ setTimeout(function() { callback(null); }, 10); };
    var undefinedFunc = function(callback){ setTimeout(function() { callback(undefined); }, 10); };
    var threeFunc = function(callback){ setTimeout(function() { callback(1, 2, 3); }, 10); };

    it('should return errors and results separately in case of tuples result', function(done){

      giveMe.sequence([errorFunc, successFunc, errorFunc], function(errors, results){
        errors.should.be.eql(['an error', null, 'an error']);
        results.should.be.eql([null, 'hello', null]);
        done();
      });
    });

    it('should return null errors and results when no errors', function(done){

      giveMe.sequence([successFunc, successFunc], function(errors, results){
        (errors === null).should.be.true;
        results.should.be.eql(['hello', 'hello']);
        done();
      });
    });

    it('should return null errors and results when null undefined and null error callbacks present', function(done){

      giveMe.sequence([nullFunc, undefinedFunc, emptyFunc], function(errors, results){
        (errors === null).should.be.true;
        results.should.be.eql([null, null, null]);
        done();
      });
    });

    it('should return errors and ignore extra results in case of callback arguments.length > 2', function(done){

      giveMe.sequence([threeFunc, threeFunc], function(errors, results){
        errors.should.be.eql([1,1]);
        results.should.be.eql([2,2]);
        done();
      });
    });

    it('should return errors and results when callback is passed by reference', function(done){

      var callback = function(errors, results){
        errors.should.be.eql([null, 'an error', 'an error', null]);
        results.should.be.eql(['hello', null, null, 'hello']);
        done();
      };

      giveMe.sequence([successFunc, errorFunc, errorFunc, successFunc], callback);
    });
  });
});