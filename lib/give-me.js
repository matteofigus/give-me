var callbacksManager = require('./callbacks-manager');
var sanitise = require('./sanitise');
var validate = require('./validate');

var GiveMe = {
  formatTasks: function(functions, args){
    var tasks = [];

    for(var i = 0; i < (functions ? functions.length : 0); i++)
      tasks.push({
        pos: i, 
        func: functions[i], 
        callbackResult: "[Not processed yet]",
        args: sanitise.argsParameter(args[i])
      });

    return tasks;
  },
  toArray: function(args){
    var arr = [];

    for(var key in args)
      arr.push(args[key]);

    return arr;
  },
  all: function(functions, args, callback){
    var parameters = sanitise.allParameters(functions, args, callback);
    validate.callbackParameter(parameters.callback);
    this.iterate(parameters);
  },
  any: function(functions, args, conditionalFunction, callback){
    var parameters = sanitise.anyParameters(functions, args, conditionalFunction, callback);
    validate.callbackParameter(parameters.callback);
    this.iterate(parameters);
  },
  iterate: function(parameters){
    var options = parameters.options,
        callback = parameters.callback,
        tasks = this.formatTasks(parameters.functions, options.args);

    if(tasks.length == 0)
      return callback([]);

    var callbacks = new callbacksManager(tasks, options);

    for(var i = 0; i < tasks.length; i++)
      this.runTask(tasks[i], callbacks, callback);    
  },
  runTask: function(task, callbacks, callback){

    var self = this,
        argsArray = self.toArray(task.args);

    argsArray.push(function(){
      callbacks.increment();
      task.callbackResult = self.toArray(arguments);
      callbacks.execute(callback);
    });

    task.func.apply(this, argsArray);   
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