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
  this.time = 0;
}

ForestLife.prototype.definition = {
  'sapling': {
    maturity: {age: 12, previous: '', next: 'tree'},
    radius: {start: 2, end: 5, growth: 0.25},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(168, 245, 28, 0.8)',
    movement: 0,
    startAge: 0,
  },

  'tree': {
    maturity: {age: 120, previous: 'sapling', next: 'elder'},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.1, child: 'sapling'},
    color: 'rgba(100, 220, 40, 0.9)',
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
    gridRows: 20,
    gridCols: 20,
    cellSize: 15,
    delay: 500,
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
  simulationCanvas.initializePause();

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
  var populateArray = function(array, type, number) {
    for (var i=0; i<number; i++) {
      var life = type ? new ForestLife(type) : null;
      array.push(life);
    }
  };

  // Generate random forest ecosystem based on ratio population
  var gridSize = simulation.getSize();
  var jackPop = Math.round(gridSize * FOREST.lumberjackRatio);
  var treePop = Math.round(gridSize * FOREST.treeRatio);
  var bearPop = Math.round(gridSize * FOREST.bearRatio);
  var emptyPop = gridSize - jackPop - treePop - bearPop;
  var initialForest = [];
  populateArray(initialForest, 'lumberjack', jackPop);
  populateArray(initialForest, 'sapling', treePop);
  populateArray(initialForest, 'bear', bearPop);
  populateArray(initialForest, null, emptyPop);

  // Adjustments to canvas
  simulationCanvas.ctx.canvas.style.backgroundColor = 'rgba(204, 236, 146, 0.55)';

  // Add forest population to simulation
  simulation.shuffle(initialForest);
  simulation.populate(initialForest);

  // Define updater
  simulation.setUpdater(function() {
    console.log(simulation.simulation.time);

    // Get reference to old grid and create new grid
    var i, j, k, life, move, neighbors, randIndex, moveTo;
    var grid = simulation.getGrid();
    simulation.initializeGrid();

    // Phase 1: movement
    for (i=0; i<grid.length; i++) {
      for (j=0; j<grid[i].length; j++) {
        for (k=0; k<grid[i][j].length; k++) {
          life = grid[i][j][k];
          if (!life) {continue;}
          var moveRow = i;
          var moveCol = j;

          // Repeat movements
          for (move=0; move<life.parameters.movement; move++) {
            neighbors = simulation.getNeighbor8(moveRow, moveCol);
            randIndex = simulation.randomInteger(0, neighbors.length);
            moveTo = neighbors[randIndex];
            moveRow = moveTo[0];
            moveCol = moveTo[1];
          }

          // Copy old cell contents to row and col of new grid
          simulation.copy(grid, i, j, k, moveRow, moveCol);
        }
      }
    }

    // Phase 2: events and growth
    for (i=0; i<simulation.grid.length; i++) {
      for (j=0; j<simulation.grid[i].length; j++) {
        for (k=0; k<simulation.grid[i][j].length; k++) {
          life = simulation.grid[i][j][k];
          if (!life) {continue;}
          life.grow();
        }
      }
    }

    // Phase 3: yearly events
  });

  console.log(simulation);
  simulation.run();

})();
