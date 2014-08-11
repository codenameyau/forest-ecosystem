/*!
 * Forest Ecosystem Simulation
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://redd.it/27h53e
 * http://codegolf.stackexchange.com/q/35322/30051
 *
 * Suggested Improvements:
 * - [done] Avoid new Array grid during updates
 * - Flexible canvas size
 * - Decouple stats from code
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


/****************
 * Main Program *
 ***************/
(function() {

  /**********************************
   * Forest Ecosystem Configuration *
   **********************************/
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
  var updatePopulation = function(type, value) {
    if (type in simulation.stats) {
      simulation.stats[type] += value;
    }
  };

  var growForestLife = function(life) {
    life.age++;

    // Update the radius of ForestLife
    if (life.parameters.radius.growth) {
      life.radius += life.parameters.radius.growth;
    }

    // Check to see if ForestLife has matured
    if (life.parameters.maturity.age > 0) {
      if (life.age === life.parameters.maturity.age) {
        var nextStage = life.parameters.maturity.next;
        life.parameters = life.definition[nextStage];
        life.type = nextStage;
      }
    }
  };

  var populateArray = function(array, type, number) {
    for (var i=0; i<number; i++) {
      var life = type ? new ForestLife(type) : null;
      array.push(life);
      updatePopulation(type, 1);
    }
  };

  var resetYearlyStats = function() {
    simulation.stats.lumber.year = 0;
    simulation.stats.maul.year = 0;
  };

  var spawnForestLife = function(type, x, y) {
    var newSapling = new ForestLife(type);
    simulation.spawn(newSapling, x, y);
    updatePopulation(type, 1);
  };

  var lumberEvent = function(life, x, y, z) {
    simulation.splice(x, y, z);
    simulation.stats.lumber.year += life.parameters.score.lumber;
    simulation.stats.lumber.total += life.parameters.score.lumber;
    updatePopulation(life.type, -1);
  };

  var maulEvent = function(x, y, z) {
    console.log('Maul!');
    simulation.splice(x, y, z);
    simulation.stats.maul.year += 1;
    simulation.stats.maul.total += 1;
    updatePopulation('lumberjack', -1);
    // Spawn lumberjack if last one is mauled
  };

  var moveForestLife = function(life) {
    var posX = life.position[0];
    var posY = life.position[1];
    var posZ = simulation.cellIndex(posX, posY, life);
    var neighbors = simulation.getNeighbor8(posX, posY);
    var randIndex = simulation.randomInteger(0, neighbors.length);
    var moveTo = neighbors[randIndex];
    var newX = moveTo[0];
    var newY = moveTo[1];
    simulation.move(posX, posY, posZ, newX, newY);
    life.position = [newX, newY];
  };

  var lumberjackEvent = function(life) {
    var x = life.position[0];
    var y = life.position[1];
    var cell = simulation.getCell(x, y);
    var triggeredEvent = false;
    for (var i=0; i<cell.length; i++) {
      var occupant = cell[i];

      // Event: encountered tree -> collect lumber
      if (occupant.type === 'tree' || occupant.type === 'elder') {
        lumberEvent(occupant, x, y, i);
        triggeredEvent = true;
      }

      // Event: encountered bear -> maul accident
      if (occupant.type === 'bear') {
        maulEvent(x, y, simulation.cellLength(x, y)-1);
        triggeredEvent = true;
        break;
      }
    }
    return triggeredEvent;
  };

  var bearEvent = function(life) {
    var x = life.position[0];
    var y = life.position[1];
    var cell = simulation.getCell(x, y);
    var triggeredEvent = false;
    for (var i=0; i<cell.length; i++) {
      var occupant = cell[i];

      // Event: encountered lumberjack -> maul accident
      if (occupant.type === 'lumberjack') {
        maulEvent(x, y, i);
        triggeredEvent = true;
      }
    }
    return triggeredEvent;
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
      // [TODO] maul tracking
    }

    console.log(simulation.stats);

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
          growForestLife(life);

          // Phase 1: spawn sapling
          if (life.parameters.spawn.chance > 0) {
            var space = simulation.getOpenSpace8(i, j);
            for (var s=0; s<space.length; s++) {
              if (simulation.randomChance() <= life.parameters.spawn.chance) {
                spawnForestLife(life.parameters.spawn.child, space[s][0], space[s][1]);
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
      for (j=0; j<life.parameters.movement; j++) {
        moveForestLife(life);
        if (lumberjackEvent(life)) {break;}
      }
    }

    // Phase 3: bear events
    for (i=0; i<bearList.length; i++) {
      life = bearList[i];
      for (j=0; j<life.parameters.movement; j++) {
        moveForestLife(life);
        if (bearEvent(life)) {break;}
      }
    }

  });

  console.log(simulation);
  simulation.run();
})();
