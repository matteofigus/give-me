var callbacksManager = require('./callbacks-manager');

var GiveMe = {
  sanitise: function(itemArgs){
    var argsType = typeof(itemArgs);

    if(argsType === 'undefined')
      itemArgs = [];
    else if(argsType !== 'object')
      itemArgs = [itemArgs];

    return itemArgs;
  },
  getInput: function(functions, args){
    var input = [];

    for(var i = 0; i < functions.length; i++)
      input.push({
        pos: i, 
        func: functions[i], 
        callbackResult: "[Not processed yet]",
        args: this.sanitise(args[i])
      });

    return input;
  },
  toArray: function(args){
    var arr = [];

    for(var key in args)
      arr.push(args[key]);

    return arr;
  },
  all: function(functions, args, callback){
    var options = { callbackMethod: 'all'};

    if(typeof(callback) === 'undefined' && typeof(args) === 'function'){ // optional args parameter not provided
      callback = args;
      options.args = [];
    } else if(typeof(args) === 'object')
      options.args = args;

    this.process(functions, options, callback);
  },
  any: function(functions, args, conditionalFunction, callback){
    var options = { callbackMethod: 'any'};

    if(typeof(conditionalFunction) === 'function' && typeof(callback) === 'function'){ // all arguments provided
      options.conditionalFunction = conditionalFunction;
      options.args = args;
    } else if(typeof(conditionalFunction) === 'function' && typeof(args) === 'function'){ // 3 params - optional is args
      options.conditionalFunction = args;
      callback = conditionalFunction;
      options.args = [];
    } else if(typeof(args) === 'object' && typeof(conditionalFunction) === 'function'){ // 3 params - optional is conditionalFunction
      callback = conditionalFunction;
      options.args = args;
    } else if(typeof(conditionalFunction) === 'undefined'){ // 2 params - both optional parameters not provided
      callback = args;
      options.args = [];
    }

    this.process(functions, options, callback);
  },
  process: function(functions, options, callback){

    if(typeof(callback) !== 'function')
      throw new Error("Callback argument is not optional");

    if(!functions || functions.length == 0)
      return callback([]);
    else if(typeof functions === "function" && options.args.length > 0){
      var fArray = []
      for(var i = 0; i < options.args.length; i++)
        fArray.push(functions);
      functions = fArray;      
    }
    
    this.iterate(functions, options, callback);
  },
  iterate: function(functions, options, callback){
    var self = this;

    var input = this.getInput(functions, options.args);
    var callbacks = new callbacksManager(input, options);

    for(var i = 0; i < input.length; i++){

      (function(item){
        var argsArray = self.toArray(item.args);

        argsArray.push(function(){
          callbacks.increment();
          item.callbackResult = self.toArray(arguments);
          callbacks.execute(callback);
        });

        item.func.apply(this, argsArray);

      })(input[i]);
    }
  }
};

module.exports = {
  all:function(functions, args, callback){
    return GiveMe.all(functions, args, callback);
  },
  any: function(functions, args, conditionalFunction, callback){
    return GiveMe.any(functions, args, conditionalFunction, callback);
  }
};

// Aliases
module.exports.first = module.exports.any;