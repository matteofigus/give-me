give-me [![Build Status](https://secure.travis-ci.org/matteofigus/give-me.png?branch=master)](http://travis-ci.org/matteofigus/give-me)
=============

[![NPM](https://nodei.co/npm/give-me.png?downloads=true)](https://npmjs.org/package/give-me)

## How it works

Give-me takes care of executing deferred functions in parallel/sequence, and allows you to use your functions exactly as they are keeping the well-known callback style. The only convention is that the callback arguments need to be the last in every function. The callback object is an array of callback results. 

## Installation

```shell
npm install give-me
```

### all(functions [, arguments] [, maxConcurrency], callback)

Runs an array of functions in parallel, and returns (with a callback) an array of callbacks in the same order when all the functions had been called.

```js
var giveMe = require('give-me');

var a = function(callback){ setTimeout((function(){ callback('a'); }), 200); };
var b = function(callback){ setTimeout((function(){ callback('b'); }), 100); };

giveMe.all([a, b], function(result){
	console.log(result);
	// will display [['a'],['b']]
});
```

If functions need some parameters to work, they can be included in the optional "arguments" parameter. Just keep the callbacks in the end.

```js
var giveMe = require('give-me');

var a = function(parameter1, parameter2, callback){ 
	setTimeout((function(){ 
		callback(parameter1 + ' ' + parameter2);
	}), 200); 
};

var b = function(parameter3, callback){ 
	setTimeout((function(){ 
		callback('hello', parameter3);
	}), 100); 
};

giveMe.all([a, b], [['hello', 'world'], ['hi']], function(result){
	console.log(result);
	// will display [['hello world'],['hello', 'hi']]
});
```

When tuple argument provided it tries to return 2 arrays of results. In case the first array (supposed to be the errors) is an array of empty values it is nullified (so that callback is a function(x, y) => null, array).

```js
var giveMe = require('give-me');

var errorFunc = function(callback){ 
	setTimeout((function(){ callback('error'); }), 200); 
};

var successFunc = function(callback){ 
	setTimeout((function(){  callback(null, 'hello'); }), 100); 
};

giveMe.all([errorFunc, successFunc], function(errors, results){
	console.log(errors); // will display ['error', null]
	console.log(results); // will display [null, 'hello'];
});

giveMe.all([successFunc, successFunc], function(errors, results){
	console.log(errors); // will display null
	console.log(results); // will display ['hello', 'hello'];
});
```

### any(functions [, arguments] [, conditionalFunction], callback)
	
Runs an array of functions in parallel, but returns (with a callback) just the fastest, ignoring all the other callbacks.

```js
var giveMe = require('give-me');

var a = function(callback){ setTimeout((function(){ callback('a'); }), 2000); };
var b = function(callback){ setTimeout((function(){ callback('b'); }), 100); };

giveMe.any([a, b], function(result){
	console.log(result);
	// will display ['[Not processed yet]',['b']]
});
```
	
Using the optional 'conditionalFunction' parameter the callback will be called when the fastest callback will satisfy a requirement provided through a sync function (in the example above, the 'c' function is the fastest that satisfies the condition, the callback for function b is anyway appended as processed before but it does not satisfies the requirement).

```js
var giveMe = require('give-me');

var a = function(param, callback){ setTimeout((function(){ callback(param) }), 200); }
var b = function(param, callback){ setTimeout((function(){ callback(param) }), 50); }
var c = function(param, callback){ setTimeout((function(){ callback(param) }), 100); }

giveMe.any([a, b, c], [true, false, true], function(itemCallback){
	return itemCallback[0] == true;
}, function(result){
	console.log(result);
	// will display ['[Not processed yet]', [false], [true]]
});
```

### sequence(functions [, arguments], callback)

Runs an array of functions in sequence, and returns (with a callback) an array of callbacks in the same order when all the functions had been called. 

```js
var giveMe = require('give-me');

var a = function(callback){ setTimeout((function(){ callback('a'); }), 200); };
var b = function(callback){ setTimeout((function(){ callback('b'); }), 100); };

giveMe.sequence([a, b], function(result){
	console.log(result);
	// will display [['a'],['b']] after ~300ms
});
```

## License

MIT