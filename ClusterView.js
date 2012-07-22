var ClusterView = function(model,CV){

  CV = {};

  var centerOffsetX = 300;
  var centerOffsetY = 240;

  var paper = Raphael(document.body, (centerOffsetX * 2), (centerOffsetY * 2));

  var starViews = [];

  var routeViews = [];

  var scale = 1;

  CV.StarView = function(model,SV){

    SV = {};

    var posX = (scale * model.position.x) + centerOffsetX;
    var posY = (scale * model.position.y) + centerOffsetY;
    var radius = (scale * 5);

    var circle = paper.circle(posX,posY,radius);
    circle.attr("fill", "#27357d");
    circle.attr("stroke", "#66d9ef");

    var text = paper.text(posX, posY + 10 + (scale * 8), model.name);
    text.attr("fill","#66d9ef");
    text.attr("font","10px Monaco");

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
    path.attr("stroke", "#66d9ef");
    return RV;
  };


  CV.render = function(){
    console.log('render');
    var i,l,e;
    var starModels = model.getStars();
    var map = model.getMap();
    var edges = map.getEdges();

    for(i = 0, l = edges.length; i < l; ++i){
      e = edges[i];
      routeViews.push(new CV.RouteView(starModels[e.nodeA],starModels[e.nodeB]));
    }

    for (var key in starModels){
      starViews.push(new CV.StarView(starModels[key]));
    }

    return CV;

  };


  return CV;

};