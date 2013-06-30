var GiveMe = {
  callbacksManager: function(input, method){
    this.count = 0;
    this.callbackDone = false;
    this.increment = function(){ this.count++; };

    this.getOutput = function(){
      var output = [];
      for(var i = 0; i < input.length; i++)
        output.push(input[i].callbackResult);
      return output;
    };

    this.execute = function(callback){
      if(((method == 'all' && this.count == input.length) 
      || (method == 'any' && this.count > 0 )) && !this.callbackDone){
        this.callbackDone = true;
        if(typeof(callback) === 'function')
          callback(this.getOutput()); 
      }
    };
  },
  getInput: function(functions, args){
    var input = [];

    for(var i = 0; i < functions.length; i++)
      input.push({
        pos: i, 
        func: functions[i], 
        callbackResult: "[Not processed]",
        args: typeof(args[i]) === 'string' ? [args[i]] : args[i] 
      });

    return input;
  },
  getArgsArray: function(args){
    var argsArray = [];

    for(i = 0; i < (args ? args.length : 0); i++)
      argsArray.push(args[i]);

    return argsArray;
  },
  getResultsArray: function(results){
    var resultsArray = [];
    for(var key in results)
      resultsArray.push(results[key]);
    return resultsArray;
  },
  all: function(functions, args, callback){
    this.process(functions, args, callback, 'all');
  },
  any: function(functions, args, callback){
    this.process(functions, args, callback, 'any');
  },
  process: function(functions, args, callback, callbackMethod){

    // Let's handle optional args parameter
    if(typeof(args) === 'function'){
      callback = args;
      args = undefined;
    }

    if(args === undefined){
      args = [];
      for(var i = 0; i < (functions ? functions.length : 0); i++)
        args.push([]);
    }

    if(!functions || functions.length == 0)
      if(callback && typeof(callback) === 'function')
        return callback([]);
      else 
        return;

    this.iterate(functions, args, callback, callbackMethod);
  },
  iterate: function(functions, args, callback, callbackMethod){
    var self = this;

    var input = this.getInput(functions, args);
    var callbacks = new this.callbacksManager(input, callbackMethod);

    for(var i = 0; i < input.length; i++){

      var wrapper = (function(item){

        var argsArray = self.getArgsArray(item.args);

        argsArray.push(function(){
          callbacks.increment();
          item.callbackResult = self.getResultsArray(arguments);
          callbacks.execute(callback);
        });

        item.func.apply(this, argsArray);

      })(input[i]);
    }
  }
};

exports.all = function(functions, args, callback){
  return GiveMe.all(functions, args, callback);
};

exports.any = exports.first = exports.first = function(functions, args, callback){
  return GiveMe.any(functions, args, callback);
};