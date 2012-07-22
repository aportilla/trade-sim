// Depends on:
//   Model.js
//   Graph.js

var Cluster = function(config){

  var CL = {},
    map = new Graph(),
    Star = new Model({
      name : '',
      planets : [],
      ships : [],
      position : { x : 0, y : 0 }
    }),
    Planet = new Model({
      name : '',
      star : '',
      foodSupply : 0
    }),
    Ship = new Model({
      cargo : '',
      capacity : 0,
      location : ''
    }),
    stars = {},
    starLookup = {},
    planets = {},
    planetLookup = {},
    i,l,j,k,s,p,r;

  // create stars and planets
  for(i = 0, l = config.stars.length; i < l; ++i){
    s = new Star(config.stars[i]);
    stars[s.id] = s;
    starLookup[s.name] = s.id;
    if (config.planets[s.name]){
      for (j = 0, k = config.planets[s.name].length; j < k; ++j){
        p = new Planet(config.planets[s.name][j]);
        p.star = s.id;
        planets[p.id] = p;
        planetLookup[p.name] = p.id;
        s.planets.push(p.id);
      }
    }
  }

  for(i = 0, l = config.routes.length; i < l; ++i){
    r = config.routes[i];
    map.addEdge(starLookup[r[0]],starLookup[r[1]]);
  }

  // add routes to map
  console.log(map.getNodes());

  CL.turn = function(){

  };
  
  return CL;

};