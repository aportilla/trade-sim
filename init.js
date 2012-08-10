$(function(){
    

  var model = new Cluster({
    stars : [
      { name : 'Sol',       position : {x:   0, y:   0} },
      { name : 'Rigil',     position : {x: 100, y:  90} },
      { name : 'Sirius',    position : {x: -90, y: 120} },
      { name : 'Luyten',    position : {x:  90, y:-160} }
    ],
    planets : {
      'Luyten' : [
        { name : 'Enderby', population :  2 },
      ],
      'Sol' : [
        { name : 'Mercury', population :  1 },
        { name : 'Venus',   population :  3, foodProduction : 0 },
        { name : 'Earth',   population : 12, foodProduction : 24 },
        { name : 'Mars',    population :  3, foodProduction :  2 }
      ],
      'Rigil' : [
        { name : 'Agathon', population :  1 },
        { name : 'Cercops', population :  3 }
      ],
      'Sirius' : [
        { name : 'Garuda',  population :  1 },
        { name : 'Parvati', population :  0 },
        { name : 'Sesha',   population :  4, foodProduction : 5 },
        { name : 'Manasa',  population :  3, foodProduction : 5 }
      ]
    },
    routes : [
      ['Sol','Rigil'],
      ['Sol','Luyten'],
      ['Sol','Sirius'],
      ['Rigil','Sirius'],
      ['Rigil','Luyten']
    ]
  });
  
  // var model = new Cluster({
  //   stars : [
  //     { name : 'Sol',       position : {x:   0, y:   0} }
  //   ],
  //   planets : {
  //     'Sol' : [
  //       { name : 'Venus',   population : 1, foodProduction : 0 },
  //       { name : 'Earth',   population : 1, foodProduction : 2 }
  //     ]
  //   },
  //   routes : [
  //   ]
  // });
  // 
  var view = new ClusterView(model);
  
  var $turnButton = $('<button class="turnButton">Turn</button>').click(function(){
    model.turn();
    view.updateUi();
  });
  
  $(document.body).append($turnButton);

  view.render();
  view.updateUi();


});