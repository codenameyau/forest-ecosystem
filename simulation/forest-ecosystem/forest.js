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
    species: 'tree',
    color: 'rgba(200, 250, 28, 0.2)',
    movement: 0,
    startAge: 0,
  },

  'tree': {
    maturity: {age: 120, previous: 'sapling', next: 'elder'},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.1, child: 'sapling'},
    species: 'tree',
    score: {lumber: 1},
    color: 'rgba(140, 230, 40, 0.3)',
    movement: 0,
    startAge: 12,
  },

  'elder': {
    maturity: {age: 0, previous: 'tree', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.2, child: 'sapling'},
    species: 'tree',
    score: {lumber: 2},
    color: 'rgba(40, 150, 20, 0.3)',
    movement: 0,
    startAge: 120,
  },

  'lumberjack': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 3, end: 3, growth: 0},
    spawn: {chance: 0.0, child: ''},
    species: 'human',
    color: 'rgba(210, 45, 45, 0.5)',
    movement: 3,
    startAge: 20,
  },

  'bear': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 5, end: 5, growth: 0},
    spawn: {chance: 0.0, child: ''},
    species: 'bear',
    color: 'rgba(120, 50, 30, 0.25)',
    movement: 5,
    startAge: 5,
  },
};

ForestLife.prototype.setPosition = function(x, y) {
  this.position = [x, y];
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
  this.population = {
    tree: [],
    human: [],
    bear: [],
  };
  this.stats = {
    lumber: {year: 0, total: 0},
    maul: {year: 0, total: 0},
  };
};

/******************************
 * Forest Ecosystem Utilities *
 ******************************/
ForestEcosystem.prototype.populateList = function(life) {
  this.population[life.parameters.species].push(life);
};

ForestEcosystem.prototype.populateForest = function() {
  // Determine population from grid size and starting ratio
  var gridSize = this.simulation.getSize();
  var jackPop = Math.round(gridSize * this.config.lumberjackRatio);
  var treePop = Math.round(gridSize * this.config.treeRatio);
  var bearPop = Math.round(gridSize * this.config.bearRatio);
  var emptyPop = gridSize - jackPop - treePop - bearPop;

  // Create and shuffle starting population
  var initialForest = [];
  this.fillArray(initialForest, 'lumberjack', jackPop);
  this.fillArray(initialForest, 'tree', treePop);
  this.fillArray(initialForest, 'bear', bearPop);
  this.fillArray(initialForest, null, emptyPop);
  this.shuffle(initialForest);
  this.populateGrid(this.simulation.getGrid(), initialForest);
};

ForestEcosystem.prototype.populateGrid = function(grid, population) {
  var count = 0;
  var rows = this.config.gridRows;
  var cols = this.config.gridCols;
  for (var i=0; i<rows; i++) {
    for (var j=0; j<cols; j++) {
      var life = population[count];
      if (life) {
        life.setPosition(i, j);
        this.populateList(life);
        grid[i][j].push(life);
      }
      count++;
    }
  }
};

ForestEcosystem.prototype.fillArray = function(array, type, number) {
  for (var i=0; i<number; i++) {
    var life = type ? new ForestLife(type) : null;
    array.push(life);
  }
};

ForestEcosystem.prototype.shuffle = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

ForestEcosystem.prototype.resetYearlyStats = function() {
  this.stats.lumber.year = 0;
  this.stats.maul.year = 0;
};


ForestEcosystem.prototype.clearList = function(list) {
  while (list.length > 0) {list.pop();}
};

ForestEcosystem.prototype.setUpdater = function(callback) {
  this.simulation.setUpdater(callback);
};

ForestEcosystem.prototype.startSimulation = function() {
  this.simulation.run();
};

/***************************
 * Forest Ecosystem Events *
 ***************************/
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

ForestEcosystem.prototype.spawnForestLife = function(type, x, y) {
  var life = new ForestLife(type);
  life.position = [x, y];
  this.simulation.spawn(life, x, y);
};

ForestEcosystem.prototype.spawnRandom = function(type) {
  var randPos = this.simulation.randomPosition();
  this.spawnForestLife(type, randPos[0], randPos[1]);
};

ForestEcosystem.prototype.removeRandom = function(forestList) {
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
};

ForestEcosystem.prototype.maulEvent = function(x, y, z) {
  this.simulation.splice(x, y, z);
  this.stats.maul.year += 1;
  this.stats.maul.total += 1;
  this.longLiveHumanity();
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

ForestEcosystem.prototype.manageLumberjacks = function() {
  var lumberCollected = this.stats.lumber.year;
  var numLumberjacks = this.stats.lumberjack;

  // Hire lumberjacks
  if (lumberCollected >= numLumberjacks) {
    var hires = Math.floor(lumberCollected / numLumberjacks);
    for (var i=0; i<hires; i++) { this.spawnRandom('lumberjack'); }
  }

  else {
    this.removeRandom('lumberjack');
  }
};

ForestEcosystem.prototype.trapBears = function() {

};




/****************
 * Main Program *
 ***************/
(function() {

  var CONFIG = {
    // GridSimulation
    canvasID: 'imagination',
    gridRows: 5,
    gridCols: 5,
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
  console.log(forest);

  /****************************
   * Forest Ecosystem Updater *
   ****************************/
  forest.setUpdater(function() {

    // console.log(forest.simulation.simulation.time);

    // Events for new year
    if (forest.simulation.simulation.time % 12 === 1) {
      // forest.manageLumberjacks();
      // forest.trapBears();
      forest.resetYearlyStats();
      // [TODO] maul tracking
    }

    // console.log(forest.stats);

    // Get reference to grid
    var grid = forest.simulation.getGrid();
    var dimension = forest.simulation.getDimensions();
    var rows = dimension[0];
    var cols = dimension[1];
    var i, j, k, len, life;

    // [Phase 1]: tree events
    for (i=0, len=forest.population.tree.length; i<len; i++) {
      life = forest.population.tree[i];
      life.grow();

      // Spawn sapling in adjacent open space
      if (life.parameters.spawn.chance > 0) {
        var space = forest.simulation.getOpenSpace8(life.position[0], life.position[1]);
        for (j=0; j<space.length; j++) {
          if (forest.simulation.randomChance() <= life.parameters.spawn.chance) {
            forest.spawnForestLife(life.parameters.spawn.child, space[j][0], space[j][1]);
            break;
          }
        }
      }
    }

    // [Phase 2]: lumberjack events
    for (i=0, len=forest.population.human.length; i<len; i++) {
      life = forest.population.human[i];
      life.grow();

      // Move lumberjack and check events
      for (j=0; j<life.parameters.movement; j++) {
        forest.moveForestLife(life);
        if (forest.lumberjackEvent(life)) {break;}
      }
    }

    // [Phase 3]: bear events
    for (i=0, len=forest.population.bear.length; i<len; i++) {
      life = forest.population.bear[i];
      life.grow();

      // Move lumberjack and check events
      for (j=0; j<life.parameters.movement; j++) {
        forest.moveForestLife(life);
        if (forest.bearEvent(life)) {break;}
      }
    }

    // Last phase: refill population
    forest.clearList(forest.population.tree);
    forest.clearList(forest.population.human);
    forest.clearList(forest.population.bear);
    for (i=0; i<rows; i++) {
      for (j=0; j<cols; j++) {
        var cell = grid[i][j];
        for (k=0, len=cell.length; k<len; k++) {
          forest.populateList(cell[k]);
        }
      }
    }
  });

  forest.startSimulation();

})();
