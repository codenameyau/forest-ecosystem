/*!
 * Forest Ecosystem Simulation
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://redd.it/27h53e
 * http://codegolf.stackexchange.com/q/35322/30051
 *
 * Suggested Improvements:
 * (1) Flexible canvas size
 * (2) Avoid new Array grid during updates
 * (3) Decouple stats from code
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
    color: 'rgba(168, 245, 28, 0.2)',
    movement: 0,
    startAge: 0,
  },

  'tree': {
    maturity: {age: 120, previous: 'sapling', next: 'elder'},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.1, child: 'sapling'},
    color: 'rgba(100, 220, 40, 0.2)',
    movement: 0,
    startAge: 12,
  },

  'elder': {
    maturity: {age: 0, previous: 'tree', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.2, child: 'sapling'},
    color: 'rgba(80, 180, 70, 0.2)',
    movement: 0,
    startAge: 120,
  },

  'lumberjack': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 4, end: 4, growth: 0},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(214, 45, 48, 0.2)',
    movement: 3,
    startAge: 20,
  },

  'bear': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(103, 0, 0, 0.2)',
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
    gridRows: 10,
    gridCols: 10,
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
  populateArray(initialForest, 'tree', treePop);
  populateArray(initialForest, 'bear', bearPop);
  populateArray(initialForest, null, emptyPop);

  // Adjustments to canvas
  simulationCanvas.ctx.canvas.style.backgroundColor = 'rgba(204, 236, 146, 0.55)';

  // Add forest population to simulation
  simulation.shuffle(initialForest);
  simulation.populate(initialForest);

  // Define simulation updater
  simulation.setUpdater(function() {
    console.log(simulation.simulation.time);

    // Events for new year
    if (simulation.simulation.time % 12 === 1) {
      simulation.stats.lumber.year = 0;
      simulation.stats.maul.year = 0;
    }

    // console.log(simulation.stats.lumber);

    // Get reference to old grid and create new grid
    var i, j, k, life, pos;
    var grid = simulation.getGrid();
    var treeList = [];
    var jackList = [];
    var bearList = [];

    // Phase 0: separate life into lists
    for (i=0; i<grid.length; i++) {
      for (j=0; j<grid[i].length; j++) {
        for (k=0; k<grid[i][j].length; k++) {
          life = grid[i][j][k];
          life.grow();
          life.position = [i, j, k];
          switch (life.type) {

          case 'tree':
          case 'elder':
            treeList.push(life);
            break;
          case 'lumberjack':
            jackList.push(life);
            break;
          case 'bear':
            bearList.push(life);
            break;
          }
        }
      }
    }

    // Phase 1: tree events
    for (i=0; i<treeList.length; i++) {
      life = treeList[i];
      pos = life.position;
      var space = simulation.getOpenSpace8(pos[0], pos[1]);
      for (var c=0; c<space.length; c++) {
        if (simulation.randomChance() <= life.parameters.spawn.chance) {
          var newSapling = new ForestLife(life.parameters.spawn.child);
          simulation.spawn(newSapling, space[c][0], space[c][1]);
          break;
        }
      }
    }

    // Phase 2: lumberjack events

    // Phase: lumberjack
    // for (i=0; i<grid.length; i++) {
    //   for (j=0; j<grid[i].length; j++) {
    //     for (k=0; k<grid[i][j].length; k++) {
    //       var life = grid[i][j][k];
    //       var currentRow = i;
    //       var currentCol = j;

    //       // Phase 1: growth
    //       life.grow();

    //       // Phase 2: tree events
    //       if (life.type === 'tree' || life.type === 'elder') {
    //         var space = simulation.getOpenSpace8(currentRow, currentCol);
    //         for (var l=0; l<space.length; l++) {
    //           if (simulation.randomChance() <= life.parameters.spawn.chance) {
    //             var newSapling = new ForestLife(life.parameters.spawn.child);
    //             simulation.spawn(newSapling, space[l][0], space[l][1]);
    //             break;
    //           }
    //         }
    //       }

    //       // Copy life from old grid to new grid
    //       simulation.copy(grid, i, j, k, currentRow, currentCol);
    //     }
    //   }
    // }

    //       // Phase 3: lumberjack events
    //       else if (life.type === 'lumberjack') {
    //         // Move lumberjack to random adjacent square
    //         for (var move=0; move<life.parameters.movement; move++) {
    //           var neighbors = simulation.getNeighbor8(currentRow, currentCol);
    //           var randIndex = simulation.randomInteger(0, neighbors.length);
    //           var moveTo = neighbors[randIndex];
    //           currentRow = moveTo[0];
    //           currentCol = moveTo[1];

    //           // Check for encounter events
    //           var content = simulation.getCell(currentRow, currentCol);
    //           for (var m=0; m<content.length; m++) {
    //             var encounter = content[m];

    //             // Event: encounters tree or elder
    //             if (encounter.type === 'tree' || encounter.type === 'elder') {
    //               move = life.parameters.movement;
    //               // [TODO] too many issues
    //               console.log(m);
    //               console.log(simulation.grid[currentRow][currentCol]);
    //               simulation.splice(currentRow, currentCol, m);
    //               simulation.stats.lumber.year++;
    //               simulation.stats.lumber.total++;
    //               break;
    //             }
    //           }
    //         }
    //       }


  });

  console.log(simulation);
  simulation.run();

})();
