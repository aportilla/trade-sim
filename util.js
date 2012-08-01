// Depends on:
//  - none

var util = function(UT){

  UT = UT || {};

  UT.probpic = function(probas,options){
    var ar = [],
      count = probas.length,
      probsum = 0,
      sum = 0,
      i;

    for (i=0; i<count; i++)
    {
      probsum += probas[i];
    }
  
    for (i=0; i<count-1 ; i++) // notice the '-1'
    {
      sum += (probas[i] / probsum);
      ar[i] = sum;
    }
  
    // random num between 0 and 1
    var r = Math.random(); 
    
    // increment through the probability spread until 
    // r is greater than the prob value
    for (i=0 ; i<ar.length && r>=ar[i] ; i++);
  
    return options[i];
  };
  
  UT.test = function(){
    
    UT.probpic([3,3,12],['a','b','c']);
  };



  UT.makeId = function() {
    var incr = 0;
    return function(){
      return 'uid:' + incr++;
    };
  }();

  //http://davidwalsh.name/javascript-clone
  UT.clone = function(src) {
    
    function mixin(dest, source, copyFunc) {
      var name, s, empty = {};
      for(name in source){
        // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
        // inherited from Object.prototype.  For example, if dest has a custom toString() method,
        // don't overwrite it with the toString() method that source inherited from Object.prototype
        s = source[name];
        if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
          dest[name] = copyFunc ? copyFunc(s) : s;
        }
      }
      return dest;
    }

    if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
      // null, undefined, any non-object, or function
      return src; // anything
    }
    if(src.nodeType && "cloneNode" in src){
      // DOM Node
      return src.cloneNode(true); // Node
    }
    if(src instanceof Date){
      // Date
      return new Date(src.getTime()); // Date
    }
    if(src instanceof RegExp){
      // RegExp
      return new RegExp(src);   // RegExp
    }
    var r, i, l;
    if(src instanceof Array){
      // array
      r = [];
      for(i = 0, l = src.length; i < l; ++i){
        if(i in src){
          r.push(UT.clone(src[i]));
        }
      }
      // we don't clone functions for performance reasons
      //    }else if(d.isFunction(src)){
      //      // function
      //      r = function(){ return src.apply(this, arguments); };
    }else{
      // generic objects
      r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, UT.clone);

  };

  return UT;

}();