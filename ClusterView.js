var ClusterView = function(cluster,CV){

  CV = {};

  var centerOffsetX = 1000;
  var centerOffsetY = 1000;

  var paper = Raphael(document.body, (centerOffsetX * 2), (centerOffsetY * 2));

  var starViews = [];

  var routeViews = [];

  var shipViews = {};

  var scale = 2;

  CV.StarView = function(star,SV){

    SV = {};

    var posX = (scale * star.position.x) + centerOffsetX;
    var posY = (scale * star.position.y) + centerOffsetY;
    var i,l,p;

    // planets
    for(i = 0, l = star.planets.length; i < l; ++i){

      var j,k,m,
        o = i * 130,
        p = cluster.getPlanet(star.planets[i]),
        orbitRadius = scale * (6 + 4 * (i+1)),
        pOrb = paper.circle(posX,posY,orbitRadius),
        pCirc = paper.circle(posX,posY,(scale * 2));

      for(j=0,k=p.name.length;j < k; ++j){
        o += p.name.charCodeAt(j);
      }

      pOrb.attr("stroke","#123");
      pCirc.attr("fill", "#234");
      pCirc.attr("stroke-width", 0);
      pCirc.transform("r" + (o % 360) + "t" + orbitRadius + ",0");
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
      boundaryCircle.attr("fill-opacity",.07);
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
    return RV;
  };

  CV.ShipView = function(ship,SV){
    SV = {};
    var circle = paper.circle(posX,posY,(scale * 2));
    circle.attr("fill", "green");
    circle.attr("stroke", "white");
    return SV;
  };


  CV.render = function(){

    var i,l,e;
    var starModels = cluster.getStars();
    var map = cluster.getMap();
    var edges = map.getEdges();

    // routes
    for(i = 0, l = edges.length; i < l; ++i){
      e = edges[i];
      routeViews.push(new CV.RouteView(starModels[e.nodeA],starModels[e.nodeB]));
    }

    // stars
    for (var key in starModels){
      starViews.push(new CV.StarView(starModels[key]));
    }

    return CV;

  };

  CV.updateUi = function(){

    var ships = cluster.getShips();

    for (var sId in ships){
      if (!shipViews[sId]){
        shipViews[sId] = new 
      }
    }

  };

  return CV;

};