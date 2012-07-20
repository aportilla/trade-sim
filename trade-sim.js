var makeId = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

var Model = function(defaults,my){
	
	defaults = defaults || {};

	return function(p,my){
		var that = that || {};
		// set obj props based on defaults...
		return that;
	};

};

var Planet = new Model({
	foodSupply : 0
});

var Ship = new Model({
	cargo : '',
	units : 0
});


var Graph = function(){

	var nodes = {};
	var edges = [];

	var Edge = function(start,end,that){
		that = that || {};
		var start = [];
		return that;
	};

	var Node = function(that){
		that = that || {};
		that.edges = [];
		return that;
	};

	return {
		addEdge : function(start,end){
			// make nodes if not yet in graph
			if (!nodes[start]){ nodes[start] = new Node(); }
			if (!nodes[end]){ nodes[end] = new Node(); }

			var newEdge = new Edge(start,end);			

			edges.push(newEdge);
			nodes[start].edges.push(newEdge);
			nodes[end].edges.push(newEdge);

		}
	};
};

var tradesim = function(){

	var planetA = new Planet({ 
		foodSupply : 60,
	});
	
	var planetB = new Planet({ 
		foodSupply : -20
	});
	
	var planetC = new Planet({ 
		foodSupply : -30
	}));

	var starChart = new Graph();

	starChart.addEdge(planetA.id,planetB.id);
	starChart.addEdge(planetB.id,planetC.id);
	starChart.addEdge(planetC.id,planetA.id);

	return {
		turn : function(){

		};
	};
  
}();