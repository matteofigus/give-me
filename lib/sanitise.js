module.exports = {
  allParameters: function(functions, args, maxConcurrentCallbacks, callback){
    var self = this,
        output = { callback: callback, options: { callbackMethod: 'all', args: [] } };

    if(typeof(callback) === 'function' && typeof(maxConcurrentCallbacks) === 'number' && typeof(args) === 'object'){
      // all arguments provided
      output.options.maxConcurrency = maxConcurrentCallbacks;
      output.options.args = args;
    } else if(typeof(callback) === 'undefined' && typeof(maxConcurrentCallbacks) === 'function' && typeof(args) === 'number'){
      // functions, maxConcurrentCallbacks, callback
      output.callback = maxConcurrentCallbacks;
      output.options.maxConcurrency = args;
    } else if(typeof(callback) === 'undefined' && typeof(maxConcurrentCallbacks) === 'function' && typeof(args) === 'object'){
      // functions, args, callback
      output.callback = maxConcurrentCallbacks;
      output.options.args = args;
    } else if(typeof(maxConcurrentCallbacks) === 'undefined' && typeof(args) === 'function'){
      // functions, callback
      output.callback = args;
    }

    output.functions = self.functionsParameter(functions, output.options);
    
    return output;
  },
  anyParameters: function(functions, args, conditionalFunction, callback){    
    var self = this,
        output = { callback: callback, options: { callbackMethod: 'any' }};

    if(typeof(conditionalFunction) === 'function' && typeof(callback) === 'function'){ 
      // all arguments provided
      output.options.conditionalFunction = conditionalFunction;
      output.options.args = args;
    } else if(typeof(conditionalFunction) === 'function' && typeof(args) === 'function'){ 
      // 3 params - optional is args
      output.options.conditionalFunction = args;
      output.callback = conditionalFunction;
      output.options.args = [];
    } else if(typeof(args) === 'object' && typeof(conditionalFunction) === 'function'){ 
      // 3 params - optional is conditionalFunction
      output.callback = conditionalFunction;
      output.options.args = args;
    } else if(typeof(conditionalFunction) === 'undefined'){ 
      // 2 params - both optional parameters not provided
      output.callback = args;
      output.options.args = [];
    }

    output.functions = self.functionsParameter(functions, output.options);

    return output;
  },
  argsParameter: function(itemArgs){
    var argsType = typeof(itemArgs);

    if(argsType === 'undefined')
      itemArgs = [];
    else if(argsType !== 'object')
      itemArgs = [itemArgs];

    return itemArgs;
  },
  functionsParameter: function(functions, options){
    if(typeof functions === "function" && options.args.length > 0){
      var fArray = []

      for(var i = 0; i < options.args.length; i++)
        fArray.push(functions);

      return fArray;      
    } else
      return functions;
  },
  sequenceParameters: function(functions, args, callback){
    var output = this.allParameters(functions, args, callback);
    output.options.callbackMethod = 'sequence';
    return output;
  }
};