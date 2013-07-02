give-me
=============
[![Build Status](https://secure.travis-ci.org/matteofigus/give-me.png?branch=master)](http://travis-ci.org/matteofigus/give-me)

## About promises with js and node.js

I've nothing against promises in js, but for me node is about semplicity, and promises are something that in my opinion should be managed in a very easy way with Javascript. All the libraries I've found use the "then" syntax to manage chaining, and require to wrap deferred functions inside a promise init/return.

Another problem is that this libraries usually need you to make your deferred functions work as they want. Usually, just one argument is accepted, and its callback needs to have one or two arguments.

Give-me does all the dirty work, and allow you to use your functions exactly as they are. The only convention is that the callback arguments need to be the last in every function.

## Installation

	npm install give-me

### all(functions [, arguments], callback)

Runs an array of functions in parallel, and returns (with a callback) an array of callbacks in the same order when all the functions had been executed.

	var giveMe = require('give-me');

	var a = function(callback){ setTimeout((function(){ callback("a"); }), 200); };
	var b = function(callback){ setTimeout((function(){ callback("b"); }), 100); };

	giveMe.all([a, b], function(result){
		console.log(result);
		// will display [["a"],["b"]]
	});

Functions could need some parameters to work, they can be included in the optional "arguments" parameter. Just keep the callbacks in the end.

	var giveMe = require('give-me');

	var a = function(parameter1, parameter2, callback){ 
		setTimeout((function(){ 
			callback(parameter1 + " " + parameter2);
		}), 200); 
	};

	var b = function(parameter3, callback){ 
		setTimeout((function(){ 
			callback("hello", parameter3);
		}), 100); 
	};

	giveMe.all([a, b], [["hello", "world"], ["hi"]], function(result){
		console.log(result);
		// will display [["hello world"],["hello", "hi"]]
	});


### any(functions [, arguments] [, conditionalFunction], callback)
	
Runs an array of functions in parallel, but returns (with a callback) just the fastest, ignoring all the other callbacks.

	var giveMe = require('give-me');
  
    var a = function(callback){ setTimeout((function(){ callback("a"); }), 2000); };
    var b = function(callback){ setTimeout((function(){ callback("b"); }), 100); };

    giveMe.any([a, b], function(result){
    	console.log(result);
    	// will display ["[Not processed yet]",["b"]]
    });

	
Using the optional "conditionalFunction" parameter the callback will be called when the fastest callback will satisfy a requirement provided through a sync function (in the example above, the "c" function is the fastest that satisfies the condition, the callback for function b is anyway appended as processed before but it does not satisfies the requirement).

	var giveMe = require('give-me');
  
    var a = function(param, callback){ setTimeout((function(){ callback(param) }), 200); }
    var b = function(param, callback){ setTimeout((function(){ callback(param) }), 50); }
    var c = function(param, callback){ setTimeout((function(){ callback(param) }), 100); }

    giveMe.any([a, b, c], [true, false, true], function(itemCallback){
    	return itemCallback[0] == true;
    }, function(result){
    	console.log(result);
    	// will display ["[Not processed yet]", [false], [true]]
    });

## License

MIT