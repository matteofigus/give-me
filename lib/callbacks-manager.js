module.exports = function(input, options){
  var count = 0, 
      callbackDone = false;

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
};