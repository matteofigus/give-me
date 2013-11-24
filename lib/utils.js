module.exports = {
  map: function(input, fnItem){
    var output = [];
    
    for(var i = 0; i < (input ? input.length : 0); i++)
      output.push(fnItem(input[i], i));

    return output;
  },
  toArray: function(obj){
    var output = [];

    for(var key in obj)
      output.push(obj[key]);

    return output;
  }
};