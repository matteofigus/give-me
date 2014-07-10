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

      now.should.be.within(19,22);

      done();
    });
  });
});