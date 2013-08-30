var GiveMe = {
  callbacksManager: function(input, options){
    var count = 0, callbackDone = false;

    var getOutput = function(){
      var output = [];
      for(var i = 0; i < input.length; i++)
        output.push(input[i].callbackResult);
      return output;
    };

    this.increment = function(){ count++; };

    this.execute = function(callback){

      var satisfied = {
        all: function(){
          return options.callbackMethod == 'all' && count == input.length;
        },
        any: function(){
          return options.callbackMethod == 'any' && count > 0 && (this.conditional() || count == input.length);
        },
        conditional: function(){
          if(!options.conditionalFunction || typeof(options.conditionalFunction) !== 'function')
            return true;

          var output = getOutput();
          for(var i = 0; i < output.length; i++)
            if(options.conditionalFunction(output[i]) == true)
              return true;

          return false;
        }
      };

      if(!callbackDone && (satisfied.all() || satisfied.any())){
        callbackDone = true;
        callback(getOutput()); 
      }
    };
  },
  getItemArgs: function(itemArgs){
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
        args: this.getItemArgs(args[i])
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
    var callbacks = new this.callbacksManager(input, options);

    for(var i = 0; i < input.length; i++){

      (function(item){
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

exports.any = exports.first = function(functions, args, conditionalFunction, callback){
  return GiveMe.any(functions, args, conditionalFunction, callback);
};