var should = require('should');

var giveMe = require('./../index');

describe('The GiveMe.all function', function(){
  it('should retrieve the callbacks in the correct order', function(done) {
	
		var a = function(callback){ setTimeout((function(){ callback("a") }), 200); }
		var b = function(callback){ setTimeout((function(){ callback("b") }), 100); }

		giveMe.all([a, b], function(result){
		  result.should.be.eql([["a"],["b"]]);
		  done();
		});
	});

  it('should process the callback whatever is its name', function(done) {
	
		var a = function(isDone){ setTimeout((function(){ isDone("a") }), 200); }
		var b = function(whenFinish){ setTimeout((function(){ whenFinish("b") }), 100); }

		giveMe.all([a, b], function(result){
		  result.should.be.eql([["a"],["b"]]);
		  done();
		});
	});

  it('should handle callbacks with multiple arguments', function(done) {
	
		var a = function(callback){ setTimeout((function(){ callback("a", "a1") }), 200); }
		var b = function(callback){ setTimeout((function(){ callback("b") }), 100); }

		giveMe.all([a, b], function(result){
		  result.should.be.eql([["a", "a1"],["b"]]);
		  done();
		});
	});

  it('should call functions with arguments', function(done) {
	
		var a = function(param, callback){ setTimeout((function(){ callback("a: " + param, "a1") }), 200); }
		var b = function(callback){ setTimeout((function(){ callback("b") }), 100); }

		giveMe.all([a, b], [["textValue"], []], function(result){
		  result.should.be.eql([["a: textValue", "a1"],["b"]]);
		  done();
		});
	});

  it('should call functions with blank arguments', function(done) {
	
		var a = function(param, callback){ setTimeout((function(){ callback("a: " + param, "a1") }), 200); }
		var b = function(callback){ setTimeout((function(){ callback("b") }), 100); }

		giveMe.all([a, b], [["textValue"], null], function(result){
		  result.should.be.eql([["a: textValue", "a1"],["b"]]);
		  done();
		});
	});

  it('should handle functions with string arguments if it is just one', function(done) {
	
		var a = function(param, callback){ setTimeout((function(){ callback("a: " + param, "a1") }), 200); }
		var b = function(param, callback){ setTimeout((function(){ callback("b: " + param) }), 100); }

		giveMe.all([a, b], ["hello", "word"], function(result){
		  result.should.be.eql([["a: hello", "a1"],["b: word"]]);
		  done();
		});
	});

  it('should handle functions with optional arguments', function(done) {
	
		var a = function(param, callback){ 
			if(typeof(param) === 'function'){
				callback = param;
				param = "blank";
			}

			setTimeout((function(){ callback("a: " + param, "a1") }), 200); 
		}

		var b = function(callback){ setTimeout((function(){ callback("b") }), 100); }

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

  it('should handle optional callback', function(done) {

  	var globalVar = 0;
	
		var a = function(callback){ setTimeout((function(){ globalVar += 1; callback(globalVar) }), 200); }
		var b = function(callback){ setTimeout((function(){ globalVar += 2; callback(globalVar) }), 100); }

		giveMe.all([a, b]);

		setTimeout((function(){ 
			globalVar.should.be.eql(3);
			done();
		}), 500);
	});
});