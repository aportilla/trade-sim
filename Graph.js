// Depends on:
//   Model.js
var Graph = function(){

  var GR = {},
    nodes = {},
    edges = {},
    Edge = new Model({
      nodeA : '',
      nodeB : ''
    }),
    Node = new Model({
      edges : []
    });

  GR.getNodes = function(eId){
    if (!eId ){ return nodes; }
    if (!edges[eId]){ return; }
    return edges[eId];
  };

  GR.getEdges = function(nId){
    if (!nId ){ return edges; }
    if (!nodes[nId]){ return; }
    return nodes[nId].edges;
  };

  GR.addEdge = function(nA,nB){

    // make nodes if not yet in graph
    if (!nodes[nA]){ nodes[nA] = new Node(); }
    if (!nodes[nB]){ nodes[nB] = new Node(); }

    var newEdge = new Edge({ 
      nodeA : nA, 
      nodeB : nB 
    });

    edges[newEdge.id] = newEdge;
    nodes[nA].edges.push(newEdge);
    nodes[nB].edges.push(newEdge);

    return GR;

  };

  return GR;

};