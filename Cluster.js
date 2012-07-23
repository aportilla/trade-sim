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
          if (planet.population - planet.food > 0){
            planet.food = planet.foodDemand - ship.capacity;
            delete ships[ship.id];
          // leave this planet
          } else {
            ship.planet = '';

          }
          break;
      }

    // ship is enroute to a star
    } else if (ship.route){

      ship.route = '';

    // ship is in a star system
    } else {

      // if a planet in star system has demand for cargo
        // land on planet
      // else
        // select neighboring star based on cargo demand
        // enter route to neighboring star.

    }

  };

  var planetAi = function(planet){

    var i,l,s;

    // set the planets food import need
    planet.foodDemand = planet.population - planet.foodProduction;

    // add production to food supply
    planet.food += planet.foodProduction;

    // consume the planets avail food
    planet.food = planet.population > planet.food ? 0 : planet.food - planet.population;

    // all leftover food gets exported on ships
    for(i = 0; i < planet.food; ++i){
      s = new Ship({
        cargo : 'food',
        planet : planet.id,
        star : planet.star
      });
      ships[s.id] = s;
    }

    planet.food = 0;

  };

  CL.getPlanet = function(pId){
    return planets[pId];
  };

  CL.getStar = function(sId){
    return stars[sId];
  };

  CL.getStars = function(){
    return stars;
  };

  CL.getMap = function(){
    return map;
  };

  // run all entity AI
  CL.turn = function(){

    // run ship AI
    for (var i in ships){
      shipAi(ships[i]);
    }

    // run planet AI
    for (var i in planets){
      planetAi(planets[i]);
    }

  };
  
  return CL;

};