module.exports = {
  callbackParameter: function(callback){
    if(typeof(callback) !== 'function')
      throw new Error("Callback argument is not optional");

    return true;
  }
};