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
      order : 0,
      randInt : 0,
      population : 0,
      foodProduction : 0,
      food : 0
    }),
    Ship = new Model({
      cargo : '',
      capacity : 1,
      planet : '',
      star : '',
      route : ''
    }),
    stars = {},
    starLookup = {},
    planets = {},
    ships = {},
    planetLookup = {},
    demand = {},
    i,l,j,k,m,n,o,s,p,r;

  CL.getDemandAtStar = function(starId,resource){
    
    var star = stars[starId],
      sDemand = 0,
      dKey = resource + 'Demand',
      planet,i,p;
      
    for (i=0,p=star.planets.length;i<p;i++){
      sDemand += planets[star.planets[i]][dKey];
    }

    return sDemand;
  
  };
  
  CL.getPlanetWithDemand = function(starId,resource){

    var star = stars[starId],
      sDemand = 0,
      dKey = resource + 'Demand',
      planetsWithDemand = [],plnt,pdem,i,p;
    
    for (i=0,p=star.planets.length;i<p;i++){
      plnt = planets[star.planets[i]];
      pdem = plnt[dKey];
      if (pdem > 0){
        planetsWithDemand.push(plnt);
      }
    }
    
    return planetsWithDemand[Math.floor(Math.random()*planetsWithDemand.length)];
    
  };

  var shipAi = function(ship){
    
    // console.log('>>> run ship ai');

    // ship is docked
    if (ship.planet){
      
      switch (ship.cargo){
        case 'none':
          ship.publish('delete');
          delete ships[ship.id];
          break;
        case 'food':
          ship.planet = '';
          break;
      }

    // ship is enroute to a star
    } else if (ship.route){

      // console.log('ship ' + ship.id + ' : i have arrived at the star : ' + ship.star);

      // arrive at the star system...
      ship.route = '';

    // ship is in a star system
    } else {

      // console.log('ship ' + ship.id + ' : i am at star ' + ship.star);
      
      // temp, select a random route and travel...
      //var starsEdges = map.getEdges(ship.star);

      
      // if a planet in star system has demand for cargo
      
      var planetWithDemand = CL.getPlanetWithDemand(ship.star,'food');

      if (planetWithDemand){
        // console.log('LAND ON PLANET with demand : ' + planetWithDemand.foodDemand);
        // console.log(planetWithDemand);
        // land on planet
        ship.planet = planetWithDemand.id;
        planetWithDemand.food += ship.capacity;
        planetWithDemand.foodDemand -= ship.capacity;
        ship.cargo = 'none';
        
      } else {
        // select neighboring star based on cargo demand
        // enter route to neighboring star.
        var edgeDemand = demand[ship.star];
        var probas = [];
        var values = [];
        for (var edg in edgeDemand){
          if (edgeDemand[edg].food <= 0){ continue; }
          probas.push(edgeDemand[edg].food);
          values.push(edg);
        }
        
        if (values.length > 0){
          var chosenEdgeId = util.probpic(probas,values);
          var chosenEdge = map.getEdge(chosenEdgeId);
          var destStar = chosenEdge.nodeA == ship.star ? chosenEdge.nodeB : chosenEdge.nodeA;
          ship.route = chosenEdge.id;
          ship.star = destStar;
        }
      }
    }

  };

  var planetAi = function(planet){

    // console.log('process planet ai for : ' + planet.name);

    var i,s;

    // set the planets food import need
    planet.foodDemand = planet.population - planet.foodProduction;

    // console.log('food demand is : ' + planet.foodDemand);

    // add produced food to current food supply
    planet.food += planet.foodProduction;

    // consume the planets avail food
    planet.food = Math.max(0,planet.food - planet.population);

    // console.log(planet);

    // all leftover food gets exported on ships
    for(i = 0; i < planet.food; ++i){
      s = new Ship({
        cargo : 'food',
        planet : planet.id,
        star : planet.star
      });
      ships[s.id] = s;
    }
  
    // no food remains at end of planet turn
    planet.food = 0;

  };

  CL.getPlanet = function(pId){
    // console.log(pId);
    return planets[pId];
  };

  CL.getStar = function(sId){
    return stars[sId];
  };

  CL.getStars = function(){
    return stars;
  };

  CL.getShips = function(){
    return ships;
  };

  CL.getMap = function(){
    return map;
  };

  // run all entity AI
  CL.turn = function(){

    // console.log('* * * * TURN * * * * *');
    
    demand = {};
    
    // run star AI
    var processDemand = function(nodeId,edgeId,originNodeId,distance){
      
      if (distance === 0){ return; }
      
      if (!demand[nodeId]){ demand[nodeId] = {}; }
      if (!demand[nodeId][edgeId]){ demand[nodeId][edgeId] = {}; }
      if (!demand[nodeId][edgeId].food){ demand[nodeId][edgeId].food = 0; }
      
      var foodDemandAtOrigin = CL.getDemandAtStar(originNodeId,'food');
      
      //console.log('demand from ' + stars[originNodeId].name + ' to  ' + stars[nodeId].name + ' is: ' + (foodDemandAtOrigin / distance));
      
      demand[nodeId][edgeId].food += foodDemandAtOrigin / distance;
      
    };
    
    for (var s in stars){
      map.ping(s,processDemand);
    } 
    // console.log(demand);
    
    // run ship AI
    for (var j in ships){
      // console.log(ships[j]);
      shipAi(ships[j]);
    }
    
    // run planet AI
    for (var i in planets){
      planetAi(planets[i]);
    }

  };
  
  var initialize = function(){

    // create stars and planets
    for(i = 0, l = config.stars.length; i < l; ++i){
      s = new Star(config.stars[i]);
      stars[s.id] = s;
      starLookup[s.name] = s.id;
      if (config.planets[s.name]){
        for (j = 0, k = config.planets[s.name].length; j < k; ++j){
          p = new Planet(config.planets[s.name][j]);
          p.rand = Math.floor(((53 + j) * p.name.charCodeAt(0))%100) / 100;
          p.order = j;
          p.star = s.id;
          planets[p.id] = p;
          planetLookup[p.name] = p.id;
          s.planets.push(p.id);
        }
      }
    }
    
    // add routes between stars to map
    for(i = 0, l = config.routes.length; i < l; ++i){
      r = config.routes[i];
      map.addEdge(starLookup[r[0]],starLookup[r[1]]);
    }

    // run planet AI
    for (var i in planets){
      planetAi(planets[i]);
    }
    
  };
  
  initialize();
  
  return CL;

};