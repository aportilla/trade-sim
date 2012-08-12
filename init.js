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
        { name : 'Enderby', size : 5, population :  2 },
      ],
      'Sol' : [
        { name : 'Ceres',   size : 1, population :  1 },
        { name : 'Vesta',   size : 1, population :  1 },
        { name : 'Mercury', size : 2, population :  1 },
        { name : 'Venus',   size : 3, population :  3, foodProduction : 0 },
        { name : 'Earth',   size : 3, population : 12, foodProduction : 24 },
        { name : 'Mars',    size : 2, population :  3, foodProduction :  2 }
      ],
      'Rigil' : [
        { name : 'Agathon', size : 5, population :  1 },
        { name : 'Cercops', size : 7, population :  6 }
      ],
      'Sirius' : [
        { name : 'Garuda',   size : 3, population :  5 },
        { name : 'Parvati',  size : 2, population :  0 },
        { name : 'Sesha',    size : 1, population :  4, foodProduction : 5 },
        { name : 'Manasa',   size : 4, population :  3, foodProduction : 5 }
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