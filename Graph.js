// Depends on:
//   Model.js
var Graph = function(){

  var GR = {},
    nodes = {},
    edges = [],
    Edge = new Model({
      nodeA : '',
      nodeB : ''
    }),
    Node = new Model({
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