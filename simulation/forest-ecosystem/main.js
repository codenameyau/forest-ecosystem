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
    score: {},
    color: 'rgba(168, 245, 28, 0.2)',
    movement: 0,
    startAge: 0,
  },

  'tree': {
    maturity: {age: 120, previous: 'sapling', next: 'elder'},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.1, child: 'sapling'},
    score: {lumber: 1},
    color: 'rgba(100, 200, 40, 0.3)',
    movement: 0,
    startAge: 12,
  },

  'elder': {
    maturity: {age: 0, previous: 'tree', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.2, child: 'sapling'},
    score: {lumber: 2},
    color: 'rgba(80, 140, 70, 0.3)',
    movement: 0,
    startAge: 120,
  },

  'lumberjack': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 3, end: 3, growth: 0},
    spawn: {chance: 0.0, child: ''},
    score: {maul: 1},
    color: 'rgba(214, 45, 48, 0.5)',
    movement: 3,
    startAge: 20,
  },

  'bear': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(120, 30, 0, 0.3)',
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


/****************
 * Main Program *
 ***************/
(function() {

  /**********************************
   * Forest Ecosystem Configuration *
   **********************************/

  // Simulation options
  var CONFIG = {
    canvasID: 'imagination',
    gridRows: 20,
    gridCols: 20,
    cellSize: 15,
    delay: 500,
    radius: 5
  };

  // Starting population ratio
  var FOREST = {
    treeRatio: 0.5,
    lumberjackRatio: 0.04,
    bearRatio: 0.02,
  };

  // GridCanvas: visualizes the simulation
  var simulationCanvas = new GridCanvas(CONFIG);

  // GridSimulation: handles the backend simulation
  var simulation = new GridSimulation(simulationCanvas);

  // Simulation GUI
  simulationCanvas.setBackground('rgba(180, 240, 90, 0.10)');
  simulationCanvas.initializePause();

  // Simulation statisitcs
  simulation.stats = {
    lumber: {year: 0, total: 0},
    maul: {year: 0, total: 0},
    sapling: 0,
    tree: 0,
    elder: 0,
    lumberjack: 0,
    bear: 0,
  };


  /******************************
   * Forest Ecosystem Functions *
   ******************************/
  var populateArray = function(array, type, number) {
    for (var i=0; i<number; i++) {
      var life = type ? new ForestLife(type) : null;
      array.push(life);
    }
  };

  var resetYearlyStats = function() {
    simulation.stats.lumber.year = 0;
    simulation.stats.maul.year = 0;
  };


  /***********************************
   * Forest Ecosystem Initialization *
   ***********************************/
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
  simulation.shuffle(initialForest);
  simulation.populate(initialForest);


  /****************************
   * Forest Ecosystem Updater *
   ****************************/
  simulation.setUpdater(function() {
    // console.log(simulation.simulation.time);

    // Events for new year
    if (simulation.simulation.time % 12 === 1) {
      resetYearlyStats();
    }

    console.log(simulation.stats.maul);

    // Get reference to old grid and create new grid
    var i, j, k, life, pos;
    var grid = simulation.getGrid();
    var jackList = [];
    var bearList = [];

    // Phase 0: separate life into lists
    for (i=0; i<grid.length; i++) {
      for (j=0; j<grid[i].length; j++) {
        for (k=0; k<grid[i][j].length; k++) {
          life = grid[i][j][k];
          life.position = [i, j];
          life.grow();

          // Phase 1: spawn sapling
          if (life.parameters.spawn.chance > 0) {
            var space = simulation.getOpenSpace8(i, j);
            for (var s=0; s<space.length; s++) {
              if (simulation.randomChance() <= life.parameters.spawn.chance) {
                var newSapling = new ForestLife(life.parameters.spawn.child);
                simulation.spawn(newSapling, space[s][0], space[s][1]);
                break;
              }
            }
          }

          // Perform lumberjack events later
          else if (life.type === 'lumberjack') {
            jackList.push(life);
          }

          // Perform bear events later
          else if (life.type === 'bear') {
            bearList.push(life);
          }
        }
      }
    }

    // Phase 2: lumberjack events
    for (i=0; i<jackList.length; i++) {
      life = jackList[i];

      // Move lumberjack
      for (j=0; j<life.parameters.movement; j++) {
        var triggeredEvent = false;
        var posX = life.position[0];
        var posY = life.position[1];
        var posZ = simulation.cellIndex(posX, posY, life);
        var neighbors = simulation.getNeighbor8(posX, posY);
        var randIndex = simulation.randomInteger(0, neighbors.length);
        var moveTo = neighbors[randIndex];
        var newX = moveTo[0];
        var newY = moveTo[1];
        var newZ = simulation.cellLength(newX, newY);
        simulation.move(posX, posY, posZ, newX, newY);
        life.position = [newX, newY];

        var cell = simulation.getCell(newX, newY);
        for (k=0; k<cell.length; k++) {
          var occupant = cell[k];

          // Event: encountered tree -> collect lumber
          if (occupant.type === 'tree' || occupant.type === 'elder') {
            simulation.splice(newX, newY, k);
            simulation.stats.lumber.year += occupant.parameters.score.lumber;
            simulation.stats.lumber.total += occupant.parameters.score.lumber;
            triggeredEvent = true;
          }

          // Event: encountered bear -> maul accident
          if (occupant.type === 'bear') {
            console.log('Encountered bear!');
            simulation.splice(newX, newY, newZ);
            simulation.stats.maul.year += 1;
            simulation.stats.maul.total += 1;
            triggeredEvent = true;
            break;
          }
        }

        // Triggered event -> stop movement
        if (triggeredEvent) {break;}
      }
    }

    // Phase 3: bear events

  });

  console.log(simulation);
  simulation.run();
})();
