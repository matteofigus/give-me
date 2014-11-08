var should = require('should');

var giveMe = require('./../index');

describe('The GiveMe.all function', function(){
  it('should retrieve the callbacks in the correct order', function(done) {
  
    var a = function(callback){ setTimeout((function(){ callback("a") }), 20); };
    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); };

    giveMe.all([a, b], function(result){
      result.should.be.eql([["a"],["b"]]);
      done();
    });
  });

  it('should execute the functions in parallel', function(done) {
  
    var a = function(callback){ setTimeout((function(){ callback("a") }), 20); };
    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); };

    var start = new Date();

    giveMe.all([a, b], function(result){
      var now = new Date() - start;
      now.should.be.within(19,22);
      done();
    });
  });

  it('should process the callback whatever is its name', function(done) {
  
    var a = function(isDone){ setTimeout((function(){ isDone("a") }), 20); };
    var b = function(whenFinish){ setTimeout((function(){ whenFinish("b") }), 10); };

    giveMe.all([a, b], function(result){
      result.should.be.eql([["a"],["b"]]);
      done();
    });
  });

  it('should handle callbacks with multiple arguments', function(done) {
  
    var a = function(callback){ setTimeout((function(){ callback("a", "a1") }), 20); };
    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); };

    giveMe.all([a, b], function(result){
      result.should.be.eql([["a", "a1"],["b"]]);
      done();
    });
  });

  it('should call functions with arguments', function(done) {
  
    var a = function(param, callback){ setTimeout((function(){ callback("a: " + param, "a1") }), 20); };
    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); };

    giveMe.all([a, b], [["textValue"], []], function(result){
      result.should.be.eql([["a: textValue", "a1"],["b"]]);
      done();
    });
  });

  it('should call functions with blank arguments', function(done) {
  
    var a = function(param, callback){ setTimeout((function(){ callback("a: " + param, "a1") }), 20); };
    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); };

    giveMe.all([a, b], [["textValue"], null], function(result){
      result.should.be.eql([["a: textValue", "a1"],["b"]]);
      done();
    });
  });

  it('should handle functions with string arguments if it is just one', function(done) {
  
    var a = function(param, callback){ setTimeout((function(){ callback("a: " + param, "a1") }), 20); };
    var b = function(param, callback){ setTimeout((function(){ callback("b: " + param) }), 10); };

    giveMe.all([a, b], ["hello", "word"], function(result){
      result.should.be.eql([["a: hello", "a1"],["b: word"]]);
      done();
    });
  });

  it('should accept a single parameter as function if the same is executed with multiple arguments', function(done) {
  
    var f = function(param, delay, callback){ setTimeout((function(){ callback(param) }), delay); };

    giveMe.all(f, [["a", 20] , ["b", 10]], function(result){
      result.should.be.eql([["a"], ["b"]]);
      done();
    });
  });

  it('should accept a single parameter as function if I need to execute it one time', function(done) {
  
    var f = function(param, delay, callback){ setTimeout((function(){ callback(param) }), delay); };

    giveMe.all(f, [["a", 20]], function(result){
      result.should.be.eql([["a"]]);
      done();
    });
  });

  it('should handle functions with optional arguments', function(done) {
  
    var a = function(param, callback){ 
      if(typeof(param) === 'function'){
        callback = param;
        param = "blank";
      }

      setTimeout((function(){ callback("a: " + param, "a1") }), 20); 
    }

    var b = function(callback){ setTimeout((function(){ callback("b") }), 10); };

    giveMe.all([a, b], function(result){
      result.should.be.eql([["a: blank", "a1"],["b"]]);
      done();
    });
  });

  it('should handle blank inputs', function(done) {

    giveMe.all(null, function(result){
      result.should.be.eql([]);
      done();
    });
  });

  it('should throw exception if the callback is not provided', function(done) {
    
    (function(){
  
      var a = function(callback){ setTimeout((function(){ callback("a") }), 20); };
      var b = function(callback){ setTimeout((function(){ callback("b") }), 10); };


      giveMe.all([a, b])
    }).should.throw("Callback argument is not optional");
    done();

  });

  it('should allow limited concurrency', function(done){

    var func = function(param, callback){ setTimeout((function(){ callback("hello " + param); }), 10); };

    var start = new Date();

    giveMe.all([func,func,func,func,func,func], [['a'],['b'],['c'],['d'],['e'],['f']], 5, function(result){

      var now = new Date() - start;

      result.should.be.eql([['hello a'],['hello b'],['hello c'],['hello d'],['hello e'],['hello f']]);

      now.should.be.within(18,23);

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

      giveMe.all([errorFunc, successFunc, errorFunc], function(errors, results){
        errors.should.be.eql(['an error', null, 'an error']);
        results.should.be.eql([null, 'hello', null]);
        done();
      });
    });

    it('should return errors and results separately when used with maxConcurrency option', function(done){

      giveMe.all([errorFunc, successFunc, errorFunc], 2, function(errors, results){
        errors.should.be.eql(['an error', null, 'an error']);
        results.should.be.eql([null, 'hello', null]);
        done();
      });
    });

    it('should return null errors and results when no errors', function(done){

      giveMe.all([successFunc, successFunc], function(errors, results){
        (errors === null).should.be.true;
        results.should.be.eql(['hello', 'hello']);
        done();
      });
    });

    it('should return null errors and results when null undefined and null error callbacks present', function(done){

      giveMe.all([nullFunc, undefinedFunc, emptyFunc], function(errors, results){
        (errors === null).should.be.true;
        results.should.be.eql([null, null, null]);
        done();
      });
    });

    it('should return errors and ignore extra results in case of callback arguments.length > 2', function(done){

      giveMe.all([threeFunc, threeFunc], function(errors, results){
        errors.should.be.eql([1,1]);
        results.should.be.eql([2,2]);
        done();
      });
    });
  });
});