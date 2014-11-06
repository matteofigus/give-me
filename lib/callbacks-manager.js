var _ = require('./utils');

module.exports = function(input, options){

  var count = 0, 
      callbackDone = false;

  this.increment = function(){ count++; };

  this.tryExecute = function(callback){

    var output = _.map(input, function(el){ return el.callbackResult; });

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

        for(var i = 0; i < output.length; i++)
          if(options.conditionalFunction(output[i]) == true)
            return true;

        return false;
      },
      sequence: function(){
        return options.callbackMethod == 'sequence' && count == input.length;
      }
    };

    var tuplifyCallback = function(callbacks){
      var errors = [], 
          results = [],
          errorsNullsOrUndefineds = 0;

      for(var i = 0; i < callbacks.length; i++){
        var cb = callbacks[i];
        errors.push(cb[0]);
        results.push(cb[1]);
        if(typeof(cb[0]) === 'undefined' || cb[0] === null)
          errorsNullsOrUndefineds++;
      };


      return {
        errors: errors.length > errorsNullsOrUndefineds ? errors : null,
        results: results
      };
    };

    if(!callbackDone && (satisfied.all() || satisfied.any() || satisfied.sequence())){
      callbackDone = true;
      if(!!callback.length && callback.length === 2){
        var callbackTuples = tuplifyCallback(output);
        callback(callbackTuples.errors, callbackTuples.results);
      } else
        callback(output); 
  
      return true;
    }
  };
};