// Depends on:
//   util.js
function Model(defaults){
  defaults = defaults || {};
  return function(p){
    p = p || {};
    var that = util.clone(defaults);
    that.id = util.makeId();
    for (var key in defaults) {
      if (typeof p[key] == 'undefined') { continue; }
      that[key] = p[key];
    }
    return that;
  };
}