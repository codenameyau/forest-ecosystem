/*!
 * Forest Ecosystem Simulation
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://redd.it/27h53e
 * http://codegolf.stackexchange.com/q/35322/30051
 */

/*---------------JSHint---------------*/
/* global GridCanvas, GridSimulation  */
/*------------------------------------*/
'use strict';


/***************************
 * Forest Life Constructor *
 ***************************/
function ForestLife(lifetype) {
  var parameters = this.definition[lifetype];
  this.type = lifetype;
  this.parameters = parameters;
  this.radius = parameters.radius.start;
  this.age = parameters.startAge;
}

ForestLife.prototype.definition = {
  'sapling': {
    maturity: {age: 12, previous: '', next: 'tree'},
    radius: {start: 2, end: 5, growth: 0.25},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(61, 214, 22, 0.8)',
    movement: 0,
    startAge: 0,
  },

  'tree': {
    maturity: {age: 120, previous: 'sapling', next: 'elder'},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.1, child: 'sapling'},
    color: 'rgba(40, 200, 40, 0.9)',
    movement: 0,
    startAge: 12,
  },

  'elder': {
    maturity: {age: 0, previous: 'tree', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.2, child: 'sapling'},
    color: 'rgba(80, 180, 70, 0.9)',
    movement: 0,
    startAge: 120,
  },

  'lumberjack': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 4, end: 4, growth: 0},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(214, 45, 48, 0.6)',
    movement: 3,
    startAge: 20,
  },

  'bear': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(103, 0, 0, 0.6)',
    movement: 5,
    startAge: 5,
  },
};

ForestLife.prototype.grow = function() {
  this.age++;

  // Update the radius of ForestLife
  if (this.parameters.radius.growth) {
    this.radius += this.parameters.radius.growth;
  }

  // Check to see if ForestLife has matured
  if (this.parameters.maturity.age > 0) {
    if (this.age === this.parameters.maturity.age) {
      var nextStage = this.parameters.maturity.next;
      this.parameters = this.definition[nextStage];
      this.type = nextStage;
    }
  }
};


/**************************
 * Program Initialization *
 **************************/
(function() {

  // Specify configuration
  var CONFIG = {
    canvasID: 'imagination',
    gridRows: 30,
    gridCols: 30,
    cellSize: 15,
    delay: 1000,
    radius: 5
  };

  // Specify starting population
  var FOREST = {
    treeRatio: 0.5,
    lumberjackRatio: 0.1,
    bearRatio: 0.02,
  };

  // GridCanvas: visualizes the simulation
  // GridSimulation: handles the backend simulation
  var simulationCanvas = new GridCanvas(CONFIG);
  var simulation = new GridSimulation(simulationCanvas);

  // Keep track of statisitcs
  simulation.stats = {
    // Simulation information
    lumber: {year: 0, total: 0},
    maul: {year: 0, total: 0},

    // ForestLife count
    sapling: 0,
    tree: 0,
    elder: 0,
    lumberjack: 0,
    bear: 0,
  };

  // Function to generate initial population
  var populateArray = function(array, value, number) {
    for (var i=0; i<number; i++) {
      array.push(value);
    }
  };

  // Generate random forest ecosystem based on ratio population
  var gridSize = simulation.getSize();
  var jackPop = Math.round(gridSize * FOREST.lumberjackRatio);
  var treePop = Math.round(gridSize * FOREST.treeRatio);
  var bearPop = Math.round(gridSize * FOREST.bearRatio);
  var emptyPop = gridSize - jackPop - treePop - bearPop;
  var initialForest = [];
  populateArray(initialForest, new ForestLife('lumberjack'), jackPop);
  populateArray(initialForest, new ForestLife('sapling'), treePop);
  populateArray(initialForest, new ForestLife('bear'), bearPop);
  populateArray(initialForest, null, emptyPop);

  // Adjustments to canvas
  simulationCanvas.ctx.canvas.style.backgroundColor = 'rgba(204, 236, 146, 0.55)';

  // Add forest population to simulation
  simulation.shuffle(initialForest);
  simulation.populate(initialForest);
  console.log(simulation);
  simulation.run();

})();
