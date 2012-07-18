var planet = function(p,my){

	var that = {};
	my = my || {};
	p = p || {};

	my.habitability = 50;
	my.mineralWealth = 1000;
	my.size = 75;

	that.population = 0;
	that.commerce = 0;
	that.agriculture = 0;
	that.mining = 0;
	that.manufacturing = 0;

	that.directive = 'balance';

	that.turn = function(){
		// calculate deltas in planet properties
		// 
	};

	return that;
};


var tradesim = function(){

  
}();