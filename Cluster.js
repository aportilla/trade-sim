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
    i,l,j,k,m,n,o,s,p,r;

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

  var shipAi = function(ship){

    // ship is docked
    if (ship.planet){

      var planet = planets[ship.planet];

      switch (ship.cargo){
        case 'food':

          // does this planet need food?
          if (planet.foodDemand > 0){
            planet.food += ship.capacity;
            planet.foodDemand -= ship.capacity;
            // console.log('ship ' + ship.id + ' : i am delivering food to planet ' + ship.planet);
            delete ships[ship.id];
          // leave this planet
          } else {

            // console.log('ship ' + ship.id + ' : i am leaving planet ' + ship.planet + ' with food');
            ship.planet = '';
          }
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
      var starsEdges = map.getEdges(ship.star);
      var edgeCount = starsEdges.length;
      var randEdgeIndex = Math.floor(Math.random()*edgeCount);
      var randEdge = starsEdges[randEdgeIndex];
      var destStar = randEdge.nodeA == ship.star ? randEdge.nodeB : randEdge.nodeA;
      ship.route = randEdge.id;
      ship.star = destStar;
      
      // if a planet in star system has demand for cargo
        // land on planet
      // else
        // select neighboring star based on cargo demand
        // enter route to neighboring star.

    }

  };

  var planetAi = function(planet){

    var i,s;

    // set the planets food import need
    planet.foodDemand = planet.population - planet.foodProduction;

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
  
  return CL;

};