$(function(){
    

  var model = new Cluster({
    stars : [
      { name : 'Sol',       position : {x:   0, y:   0} },
      { name : 'Rigil',     position : {x: 100, y:  90} },
      { name : 'Sirius',    position : {x: -90, y: 120} },
      { name : 'Luyten',    position : {x:  90, y:-160} }
    ],
    planets : {
      'Sol' : [
        { name : 'Mercury', population :  1 },
        { name : 'Venus',   population :  3, foodProduction : 0 },
        { name : 'Earth',   population : 12, foodProduction : 26 },
        { name : 'Mars',    population :  3, foodProduction :  2 }
      ],
      'Rigil' : [
        { name : 'Agathon', population :  1 },
        { name : 'Cercops', population :  3 }
      ],
      'Sirius' : [
        { name : 'Garuda',  population :  1 },
        { name : 'Parvati', population :  0 },
        { name : 'Sesha',   population :  3, foodProduction : 5 },
        { name : 'Manasa',  population :  3 }
      ]
    },
    routes : [
      ['Sol','Rigil'],
      ['Sol','Luyten'],
      ['Sol','Sirius'],
      ['Rigil','Sirius']
    ]
  });
  
  var view = new ClusterView(model);

  view.render();

  model.turn();

  view.updateUi();

  model.turn();

  view.updateUi();


});