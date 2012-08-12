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
    var orbitalRadius = scale * 4;
    var theta =  2 * Math.PI * ((planet.order + 1) / 6) - Math.PI;
    var xPosition = orbitalRadius * Math.cos(theta);
    var yPosition = orbitalRadius * Math.sin(theta);
    
    return {
      x : star.position.x + xPosition,
      y : star.position.y + yPosition,
      size : planet.size
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
        pCirc = paper.circle(pPosX,pPosY,(scale * (1.5 + 2 * (pPos.size / 10))));
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
    
    var abX = Math.abs(aX - bX);
    var abY = Math.abs(aY - bY);
    var distance = Math.round(Math.sqrt(abX * abX + abY * abY) * 100);
    var path = paper.path("M" + aX + " " + aY + "L" + bX + " " + bY);
    path.attr("stroke", "#234");
    // path.attr("stroke", "#fff");
    
    RV.ship = function(starA,callback){
      
      var circle = paper.circle(aX,aY,scale / 2);
      circle.attr("fill", "green");
      circle.attr("stroke-width", 0);
      
      var randomXOff = scale * Math.floor(Math.random() * 5);
      var randomYOff = scale * Math.floor(Math.random() * 5);
      
      var randomSpeedVariance = Math.random() * 10000 - 5000;
      
      console.log(distance);
      console.log(randomSpeedVariance);
      
      var begin = function(){
        circle.attr({ cx : aX + randomXOff, cy : aY + randomYOff });
        circle.animate(anim);
      };
      
      var anim = Raphael.animation({ cx : bX + randomXOff, cy : bY + randomYOff }, (distance - randomSpeedVariance),'linear',begin);
      
      begin();
      
    };
    
    return RV;
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

    // for (var sId in ships){
    //   if (!shipViews[sId]){
    //     shipViews[sId] = new CV.ShipView(ships[sId]);
    //   }
    // 
    //   shipViews[sId].updateUi();
    // }
    
    for (var i=0; i<routeViews.length;i++){
      console.log(i);
      routeViews[i].ship();
    }
    
    

  };

  return CV;

};