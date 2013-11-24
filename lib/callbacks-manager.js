module.exports = function(input, options){

  var count = 0, 
      callbackDone = false;

  this.increment = function(){ count++; };

  this.tryExecute = function(callback){

    var getOutput = function(){
      var output = [];
      for(var i = 0; i < input.length; i++)
        output.push(input[i].callbackResult);
      return output;
    };

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
      },
      sequence: function(){
        return options.callbackMethod == 'sequence' && count == input.length;
      }
    };

    if(!callbackDone && (satisfied.all() || satisfied.any() || satisfied.sequence())){
      callbackDone = true;
      callback(getOutput()); 
      return true;
    }
  };
};