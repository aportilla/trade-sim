var ClusterView = function(cluster,CV){

  CV = {};

  var centerOffsetX = 1000;
  var centerOffsetY = 1000;

  var paper = Raphael(document.body, (centerOffsetX * 2), (centerOffsetY * 2));

  var starViews = [];

  var routeViews = [];

  var shipViews = {};

  var scale = 2;
  
  var map = cluster.getMap();
  
  var getPlanetPosition = function(planetId){
    
    var planet = cluster.getPlanet(planetId);
    var star = cluster.getStar(planet.star);
    var orbitalRadius = 6 + 4 * ( planet.order + 1 );
    var randTheta = planet.rand * 2 * Math.PI;
    var xPosition = orbitalRadius * Math.cos(randTheta);
    var yPosition = orbitalRadius * Math.sin(randTheta);
    
    // console.log(planet.name + ' is at ' + xPosition + ':' + yPosition);
    
    return {
      x : star.position.x + xPosition,
      y : star.position.y + yPosition,
      r : orbitalRadius
    };
    
  };
  
  // get a random position along a given route...
  var getRoutePosition = function(routeId){
    var route = map.getEdge(routeId);
    var starA = cluster.getStar(route.nodeA);
    var starB = cluster.getStar(route.nodeB);
    var posA = starA.position;
    var posB = starB.position;
    var randDist = (Math.random() * 6 + 2) / 10; // random X < .8 && > .2
    var randOffX = Math.random() * 10 - 5;
    var randOffY = Math.random() * 10 - 5;
    var xDiff = posA.x - posB.x;
    var yDiff = posA.y - posB.y;
    var xMid = posB.x + (xDiff * randDist) + randOffX;
    var yMid = posB.y + (yDiff * randDist) + randOffY;
    return {
      x : xMid,
      y : yMid
    };
  };

  CV.StarView = function(star,SV){

    SV = {};

    var posX = (scale * star.position.x) + centerOffsetX;
    var posY = (scale * star.position.y) + centerOffsetY;
    var i,l,pPos;

    // planets
    for(i = 0, l = star.planets.length; i < l; ++i){

      pPos = getPlanetPosition(star.planets[i]);

      var pPosX = (scale * pPos.x) + centerOffsetX,
        pPosY = (scale * pPos.y) + centerOffsetY,
        pOrb = paper.circle(posX,posY,scale * pPos.r),
        pCirc = paper.circle(pPosX,pPosY,(scale * 2));

      pOrb.attr("stroke","#123");
      pCirc.attr("fill", "#234");
      pCirc.attr("stroke-width", 0);
    
    }

    var circle = paper.circle(posX,posY,(scale * 3));
    // circle.attr("fill", "#27357d");
    // circle.attr("stroke", "#66d9ef");
    circle.attr("fill", "yellow");
    circle.attr("stroke", "white");

    var text = paper.text(posX, posY + 10 + (scale * 8), star.name);
    text.attr("fill","#66d9ef");
    text.attr("font","10px Monaco");

    var boundaryCircle = paper.circle(posX,posY,(scale * 20));
    boundaryCircle.attr("fill", "#0099ff");
    boundaryCircle.attr("stroke", "#fff");
    boundaryCircle.attr("fill-opacity", 0);
    boundaryCircle.attr("stroke-width", 0);


    var handleClick = function(){
      // handle star click
    };

    var hoverIn = function(){
      boundaryCircle.attr("fill-opacity",0.07);
      boundaryCircle.attr("r",(scale * 40));
    };

    var hoverOut = function(){
      boundaryCircle.attr("fill-opacity",0);
      boundaryCircle.attr("r",(scale * 20));
    };

    boundaryCircle.click(handleClick);
    boundaryCircle.hover(hoverIn,hoverOut);

    SV.update = function(){};

    return SV;
  
  };

  CV.RouteView = function(starA,starB,RV){
    RV = {};
    var aX = (scale * starA.position.x) + centerOffsetX;
    var aY = (scale * starA.position.y) + centerOffsetY;
    var bX = (scale * starB.position.x) + centerOffsetX;
    var bY = (scale * starB.position.y) + centerOffsetY;
    var path = paper.path("M" + aX + " " + aY + "L" + bX + " " + bY);
    path.attr("stroke", "#234");
    // path.attr("stroke", "#fff");
    return RV;
  };

  CV.ShipView = function(ship,SV){
    
    SV = {};

    var getShipPosition = function(){
      
      var newX = 0;
      var newY = 0;
      
      // ship is at a planet
      if (ship.planet){
        // console.log('ship is at a planet!');
        // console.log('place on planet : ' + ship.planet);
        var pPos = getPlanetPosition(ship.planet);
        newX = (scale * pPos.x) + centerOffsetX;
        newY = (scale * pPos.y) + centerOffsetY;

      // ship is enroute to a star
      } else if (ship.route){
// console.log('ship is at a route!');
        
        // console.log('place in route : ' + ship.route);
        var routePos = getRoutePosition(ship.route);
        newX = scale * routePos.x + centerOffsetX;
        newY = scale * routePos.y + centerOffsetY;
        
      // ship is in a star system
      } else {
// console.log('ship is at a star!');
        var star = cluster.getStar(ship.star);
        // var randYOffset = (Math.round(Math.random()) ? 1 : -1) * (Math.floor((Math.random()*30)) + (Math.abs(randXOffset) < 10 ? 10 : 0));
        // var randXOffset = (Math.round(Math.random()) ? 1 : -1) * Math.floor((Math.random()*40));
      
        var randR = (Math.floor(Math.random()*25) + 6);
        var randTheta = Math.random() * 2 * Math.PI;
        var randXOffset = randR * Math.cos(randTheta);
        var randYOffset = randR * Math.sin(randTheta);
      
        newX = (scale * star.position.x) + centerOffsetX + (scale * randXOffset);
        newY = (scale * star.position.y) + centerOffsetY + (scale * randYOffset);
      }
      
      return {
        cx : newX,
        cy : newY
      };
    };


    // console.log('create ship view');
    var initPos = getShipPosition();
    var circle = paper.circle(initPos.cx,initPos.cy,scale);
    circle.attr("fill", "green");
    circle.attr("stroke-width", 0);
    
    SV.updateUi = function(){


      var anim = Raphael.animation(getShipPosition(), 1000,'easeInOut');
      //circle.animate(anim); // run the given animation immediately
      var delay = Math.floor(Math.random() * 2000);
      circle.animate(anim.delay(delay)); // run the given animation after 500 ms

      // ship is at a planet
      if (ship.planet){
        //circle.hide();
      // ship is enroute to a star
      } else if (ship.route){
        
        //circle.show();
      // ship is in a star system
      } else {
        
        circle.show();
      }


    };
    
    ship.subscribe('delete',function(){
      circle.remove();
    });

    return SV;
  };


  CV.render = function(){

    var i,l,e;
    var starModels = cluster.getStars();
    var map = cluster.getMap();
    var edges = map.getEdges();

    // routes
    for (var edgeId in edges){
      e = edges[edgeId];
      routeViews.push(new CV.RouteView(starModels[e.nodeA],starModels[e.nodeB]));
    }

    // stars
    for (var starId in starModels){
      starViews.push(new CV.StarView(starModels[starId]));
    }

    return CV;

  };

  CV.updateUi = function(){

    var ships = cluster.getShips();

    for (var sId in ships){
      if (!shipViews[sId]){
        shipViews[sId] = new CV.ShipView(ships[sId]);
      }

      shipViews[sId].updateUi();
    }

  };

  return CV;

};