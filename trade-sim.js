var makeId = function() {
  var incr = 0;
  return function(){
    return 'uid:' + incr++;
  };
}();

//http://davidwalsh.name/javascript-clone
var clone = function(src) {
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
        r.push(clone(src[i]));
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
  return mixin(r, src, clone);

};

var Model = function(defaults){
  defaults = defaults || {};
  return function(p){
    p = p || {};
    var myDefaults = clone(defaults);
    var that = { id : makeId() };
    for (var key in myDefaults) {
      that[key] = typeof p[key] == 'undefined' ? myDefaults[key] : p[key];
    }
    return that;
  };
};

var Planet = new Model({
  foodSupply : 0
});

var Ship = new Model({
  cargo : '',
  units : 0
});


var Graph = function(){

  var GR = {};  
  var nodes = {};
  var edges = [];

  var Edge = new Model({
    pointA : '',
    pointB : ''
  });

  var Node = new Model({
    edges : []
  });

  GR.getNodes = function(){
    return nodes;
  };

  GR.getEdges = function(){
    return edges;
  };

  GR.addEdge = function(nA,nB){

    // make nodes if not yet in graph
    if (!nodes[nA]){ nodes[nA] = new Node(); }
    if (!nodes[nB]){ nodes[nB] = new Node(); }

    var newEdge = new Edge({ 
      nodeA : nA, 
      nodeB : nB 
    });      

    edges.push(newEdge);
    nodes[nA].edges.push(newEdge);
    nodes[nB].edges.push(newEdge);

    return GR;

  };

  return GR;

};

var tradesim = function(){

  var planetA = new Planet({ 
    foodSupply : 60
  });
  
  var planetB = new Planet({ 
    foodSupply : -20
  });
  
  var planetC = new Planet({ 
    foodSupply : -30
  });

  var starChart = new Graph();

  starChart.addEdge(planetA.id,planetB.id)
           .addEdge(planetB.id,planetC.id)
           .addEdge(planetC.id,planetA.id);

  console.log(starChart.getNodes());

  return {
    turn : function(){

    }
  };
  
}();