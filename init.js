$(function(){
    

  var model = new Cluster({
    stars : [
      { name : 'Sol',       position : {x:0,y:0} },
      { name : 'Rigil',     position : {x:100,y:90} },
      { name : 'Sirius',    position : {x:-90,y:120} },
      { name : 'Luyten',    position : {x:90,y:-160} }
    ],
    planets : {
      'Sol' : [
        { name : 'Mercury', foodSupply : 0 },
        { name : 'Venus',   foodSupply : -2 },
        { name : 'Earth',   foodSupply :  4 },
        { name : 'Mars',    foodSupply : -1 }
      ],
      'Rigil' : [
        { name : 'Agathon', foodSupply :  1 },
        { name : 'Cercops', foodSupply : -3 }
      ],
      'Sirius' : [
        { name : 'Garuda',  foodSupply :  1 },
        { name : 'Parvati', foodSupply :  0 },
        { name : 'Sesha',   foodSupply : -3 },
        { name : 'Manasa',  foodSupply : -3 }
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