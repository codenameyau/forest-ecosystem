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
 * - [done] Decouple stats from code
 * - [done] Modularize into components
 * - Flexible canvas size
 * - Elegantly solve loop and splice
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
    color: 'rgba(200, 250, 28, 0.2)',
    movement: 0,
    startAge: 0,
  },

  'tree': {
    maturity: {age: 120, previous: 'sapling', next: 'elder'},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.1, child: 'sapling'},
    score: {lumber: 1},
    color: 'rgba(140, 230, 40, 0.3)',
    movement: 0,
    startAge: 12,
  },

  'elder': {
    maturity: {age: 0, previous: 'tree', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.2, child: 'sapling'},
    score: {lumber: 2},
    color: 'rgba(40, 150, 20, 0.3)',
    movement: 0,
    startAge: 120,
  },

  'lumberjack': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 3, end: 3, growth: 0},
    spawn: {chance: 0.0, child: ''},
    score: {maul: 1},
    color: 'rgba(210, 45, 45, 0.5)',
    movement: 3,
    startAge: 20,
  },

  'bear': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.0, child: ''},
    color: 'rgba(120, 50, 30, 0.25)',
    movement: 5,
    startAge: 5,
  },
};


/********************************
 * Forest Ecosystem Constructor *
 ********************************/
function ForestEcosystem(config) {
  this.config = config;
  this.initializeCanvasGUI();
  this.initializeSimulation();
}

ForestEcosystem.prototype.initializeCanvasGUI = function() {
  this.gridCanvas = new GridCanvas(this.config);
  this.gridCanvas.setBackground('rgba(180, 240, 90, 0.10)');
  this.gridCanvas.initializePause();
};

ForestEcosystem.prototype.initializeSimulation = function() {
  this.simulation = new GridSimulation(this.gridCanvas);
  this.stats = {
    lumber: {year: 0, total: 0},
    maul: {year: 0, total: 0},
    sapling: 0,
    tree: 0,
    elder: 0,
    lumberjack: 0,
    bear: 0,
  };
};

ForestEcosystem.prototype.populateForest = function() {
  // Determine population from grid size and starting ratio
  var gridSize = this.simulation.getSize();
  var jackPop = Math.round(gridSize * this.config.lumberjackRatio);
  var treePop = Math.round(gridSize * this.config.treeRatio);
  var bearPop = Math.round(gridSize * this.config.bearRatio);
  var emptyPop = gridSize - jackPop - treePop - bearPop;
  this.updatePopulation('lumberjack', jackPop);
  this.updatePopulation('tree', treePop);
  this.updatePopulation('bear', bearPop);
  // Create and shuffle starting population
  var initialForest = [];
  this.populateArray(initialForest, 'lumberjack', jackPop);
  this.populateArray(initialForest, 'tree', treePop);
  this.populateArray(initialForest, 'bear', bearPop);
  this.populateArray(initialForest, null, emptyPop);
  this.simulation.shuffle(initialForest);
  this.simulation.populate(initialForest);
};

ForestEcosystem.prototype.updatePopulation = function(type, value) {
  if (type in this.stats) {
    this.stats[type] += value;
  }
};

ForestEcosystem.prototype.growLife = function(life) {
  life.age++;

  // Update the radius of ForestLife
  if (life.parameters.radius.growth) {
    life.radius += life.parameters.radius.growth;
  }

  // Check to see if ForestLife has matured
  if (life.parameters.maturity.age > 0) {
    if (life.age === life.parameters.maturity.age) {
      this.updatePopulation(life.type, -1);
      var nextStage = life.parameters.maturity.next;
      life.parameters = life.definition[nextStage];
      life.type = nextStage;
      this.updatePopulation(life.type, 1);
    }
  }
};

ForestEcosystem.prototype.populateArray = function(array, type, number) {
  for (var i=0; i<number; i++) {
    var life = type ? new ForestLife(type) : null;
    array.push(life);
  }
};

ForestEcosystem.prototype.resetYearlyStats = function() {
  this.stats.lumber.year = 0;
  this.stats.maul.year = 0;
};

ForestEcosystem.prototype.spawnForestLife = function(type, x, y) {
  var life = new ForestLife(type);
  this.simulation.spawn(life, x, y);
  this.updatePopulation(type, 1);
};

ForestEcosystem.prototype.spawnRandom = function(type) {
  var randPos = this.simulation.randomPosition();
  this.spawnForestLife(type, randPos[0], randPos[1]);
};

ForestEcosystem.prototype.longLiveHumanity = function() {
  if (this.stats.lumberjack <= 0) {
    this.spawnRandom('lumberjack');
  }
};

ForestEcosystem.prototype.lumberEvent = function(life, x, y, z) {
  this.simulation.splice(x, y, z);
  this.stats.lumber.year += life.parameters.score.lumber;
  this.stats.lumber.total += life.parameters.score.lumber;
  this.updatePopulation(life.type, -1);
};

ForestEcosystem.prototype.maulEvent = function(x, y, z) {
  this.simulation.splice(x, y, z);
  this.stats.maul.year += 1;
  this.stats.maul.total += 1;
  this.updatePopulation('lumberjack', -1);
  this.longLiveHumanity();
};

ForestEcosystem.prototype.moveForestLife = function(life) {
  var posX = life.position[0];
  var posY = life.position[1];
  var posZ = this.simulation.cellIndex(posX, posY, life);
  var neighbors = this.simulation.getNeighbor8(posX, posY);
  var randIndex = this.simulation.randomInteger(0, neighbors.length);
  var moveTo = neighbors[randIndex];
  var newX = moveTo[0];
  var newY = moveTo[1];
  this.simulation.move(posX, posY, posZ, newX, newY);
  life.position = [newX, newY];
};

ForestEcosystem.prototype.lumberjackEvent = function(life) {
  var x = life.position[0];
  var y = life.position[1];
  var triggeredEvent = false;
  var cell = this.simulation.getCell(x, y);
  var z = cell.length-1;

  // [Issue] Becareful with looping and splicing
  for (var i=0, len=cell.length; i<len; i++) {
    var occupant = cell[i];
    if (occupant === life) {continue;}

    // Event: encountered tree -> collect lumber
    if (occupant.type === 'tree' || occupant.type === 'elder') {
      triggeredEvent = true;
      this.lumberEvent(occupant, x, y, i);
      i--;
      len--;
    }

    // Event: encountered bear -> maul accident
    if (occupant.type === 'bear') {
      triggeredEvent = true;
    }
  }
  return triggeredEvent;
};

ForestEcosystem.prototype.bearEvent = function(life) {
  var x = life.position[0];
  var y = life.position[1];
  var triggeredEvent = false;
  var cell = this.simulation.getCell(x, y);
  for (var i=0, len=cell.length; i<len; i++) {
    var occupant = cell[i];
    if (occupant === life) {continue;}

    // Event: encountered lumberjack -> maul accident
    if (occupant.type === 'lumberjack') {
      this.maulEvent(x, y, i);
      triggeredEvent = true;
      i--;
      len--;
    }
  }
  return triggeredEvent;
};

ForestEcosystem.prototype.hireLumberjacks = function() {
  var lumberCollected = this.stats.lumber.year;
  var lumberjacks = this.stats.lumberjack;
  if (lumberCollected >= lumberjacks) {
    var hires = Math.floor(lumberCollected / lumberjacks);
    this.spawnRandom('lumberjack');
  }
};

ForestEcosystem.prototype.trapBears = function() {

};

ForestEcosystem.prototype.setUpdater = function(callback) {
  this.simulation.setUpdater(callback);
};

ForestEcosystem.prototype.startSimulation = function() {
  this.simulation.run();
};


/****************
 * Main Program *
 ***************/
(function() {

  var CONFIG = {
    // GridSimulation
    canvasID: 'imagination',
    gridRows: 10,
    gridCols: 10,
    cellSize: 15,
    delay: 200,
    radius: 5,

    // Strating population
    treeRatio: 0.5,
    lumberjackRatio: 0.10,
    bearRatio: 0.02,
  };

  var forest = new ForestEcosystem(CONFIG);
  forest.populateForest();

  /****************************
   * Forest Ecosystem Updater *
   ****************************/
  forest.setUpdater(function() {

    // console.log(forest.simulation.simulation.time);

    // Events for new year
    if (forest.simulation.simulation.time % 12 === 1) {
      forest.hireLumberjacks();
      forest.trapBears();
      forest.resetYearlyStats();
      // [TODO] maul tracking
    }

    // console.log(forest.simulation.stats.lumberjack);

    // Get reference to old grid and create new grid
    var i, j, k, life, pos;
    var grid = forest.simulation.getGrid();
    var jackList = [];
    var bearList = [];

    // Phase 0: separate life into lists
    for (i=0; i<grid.length; i++) {
      for (j=0; j<grid[i].length; j++) {
        for (k=0; k<grid[i][j].length; k++) {
          life = grid[i][j][k];
          life.position = [i, j];
          forest.growLife(life);

          // Phase 1: spawn sapling
          if (life.parameters.spawn.chance > 0) {
            var space = forest.simulation.getOpenSpace8(i, j);
            for (var s=0; s<space.length; s++) {
              if (forest.simulation.randomChance() <= life.parameters.spawn.chance) {
                forest.spawnForestLife(life.parameters.spawn.child, space[s][0], space[s][1]);
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
        forest.moveForestLife(life);
        if (forest.lumberjackEvent(life)) {break;}
      }
    }

    // Phase 3: bear events
    for (i=0; i<bearList.length; i++) {
      life = bearList[i];
      for (j=0; j<life.parameters.movement; j++) {
        forest.moveForestLife(life);
        if (forest.bearEvent(life)) {break;}
      }
    }
  });

  forest.startSimulation();

})();
