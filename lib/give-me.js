var CallbacksManager = require('./callbacks-manager');
var sanitise = require('./sanitise');
var validate = require('./validate');
var _ = require('./utils');

var giveMe = {
  all: function(functions, args, maxConcurrentCallbacks, callback){
    var parameters = sanitise.allParameters(functions, args, maxConcurrentCallbacks, callback);
    validate.callbackParameter(parameters.callback);
    this.iterate(parameters);
  },
  any: function(functions, args, conditionalFunction, callback){
    var parameters = sanitise.anyParameters(functions, args, conditionalFunction, callback);
    validate.callbackParameter(parameters.callback);
    this.iterate(parameters);
  },
  sequence: function(functions, args, callback){
    var parameters = sanitise.sequenceParameters(functions, args, callback);
    validate.callbackParameter(parameters.callback);
    this.iterate(parameters);
  },
  iterate: function(parameters){
    var options = parameters.options,
        callback = parameters.callback,
        maxConcurrency = options.maxConcurrency,
        tasks = this.formatTasks(parameters.functions, options.args);

    if(tasks.length == 0)
      return callback([]);

    var callbacks = new CallbacksManager(tasks, options);

    if(options.callbackMethod == 'sequence')
      this.runSequenceTask(tasks, 0, 1, callbacks, callback);
    else 
      if(!maxConcurrency)
        for(var i = 0; i < tasks.length; i++)
          this.runTask(tasks[i], callbacks, callback);    
      else {

        for(var i = 0; i < Math.min(tasks.length, maxConcurrency); i++)
          this.runSequenceTask(tasks, i, maxConcurrency, callbacks, callback);
      }
  },
  formatTasks: function(functions, args){
    return _.map(functions, function(func, i){
      return {
        pos: i,
        func: func,
        callbackResult: "[Not processed yet]",
        args: sanitise.argsParameter(args[i])
      };
    });
  },
  runTask: function(task, callbacks, callback){

    var argsArray = _.toArray(task.args);

    argsArray.push(function(){
      callbacks.increment();
      task.callbackResult = _.toArray(arguments);
      callbacks.tryExecute(callback);
    });

    task.func.apply(this, argsArray);   
  },
  runSequenceTask: function(tasks, i, increment, callbacks, callback){

    var self = this,
        task = tasks[i];

    if(!callbacks.tryExecute(callback) && typeof(task) !== 'undefined'){

      (function(taskFunction, taskArgs, taskCallback){

        var argsArray = taskArgs;
        argsArray.push(taskCallback);
        taskFunction.apply(this, argsArray);

      })(task.func, task.args, function(){

        callbacks.increment();
        task.callbackResult = _.toArray(arguments);
        self.runSequenceTask(tasks, i + increment, increment, callbacks, callback);

      });
    }
  }
};

module.exports = {
  all:function(functions, args, maxConcurrentCallbacks, callback){
    return giveMe.all(functions, args, maxConcurrentCallbacks, callback);
  },
  any: function(functions, args, conditionalFunction, callback){
    return giveMe.any(functions, args, conditionalFunction, callback);
  },
  sequence: function(functions, args, callback){
    return giveMe.sequence(functions, args, callback);
  }
};

// Aliases
module.exports.first = module.exports.any;