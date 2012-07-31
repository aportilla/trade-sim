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

  // a breadth first traversal of the graph
  // from a particular node
  // triggering the callback for each node
  // with originNode, endNode, and distance as arguments
  GR.ping = function(nId,callback,scope){
    
    var Q = [],
      qued = {},
      distance = {},
      u,i,l,v,e;
      
    Q.push(nId);
    qued[nId] = true;
    distance[nId] = 0;
    
    while (Q.length > 0) {
        u = Q.splice(0, 1)[0];
        callback.call(scope,nId,u,distance[u]);
        for (i = 0,l = nodes[u].edges.length; i < l; i++) {
            e = nodes[u].edges[i];
            v = e.nodeA == u ? e.nodeB : e.nodeA;
            if (!qued[v]) {
                distance[v] = distance[u] + 1;
                Q.push(v);
                qued[v] = true;
            }
        }
    }
    
  };

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