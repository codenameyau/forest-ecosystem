/*!
 * Forest Ecosystem Simulation
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://redd.it/27h53e
 * http://codegolf.stackexchange.com/q/35322/30051
 *
 * Suggested Improvements:
 * - [done] Forest life definition prototype
 * - [done] Avoid new Array grid during updates
 * - [done] Decouple stats from code
 * - [done] Modularize into components
 * - [done] Define species to simplify loops
 * - [done] Automatic canvas size and zoom
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
    radius: {start: 2, end: 11, growth: 0.75},
    spawn: {chance: 0.0, child: ''},
    species: 'tree',
    color: 'rgba(200, 250, 28, 0.6)',
    movement: 0,
    startAge: 0,
  },

  'tree': {
    maturity: {age: 120, previous: 'sapling', next: 'elder'},
    radius: {start: 11, end: 11, growth: 0},
    spawn: {chance: 0.1, child: 'sapling'},
    species: 'tree',
    score: {lumber: 1},
    color: 'rgba(140, 230, 40, 0.6)',
    movement: 0,
    startAge: 12,
  },

  'elder': {
    maturity: {age: 0, previous: 'tree', next: ''},
    radius: {start: 11, end: 11, growth: 0},
    spawn: {chance: 0.2, child: 'sapling'},
    species: 'tree',
    score: {lumber: 2},
    color: 'rgba(60, 180, 30, 0.6)',
    movement: 0,
    startAge: 120,
  },

  'lumberjack': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 6, end: 6, growth: 0},
    spawn: {chance: 0.0, child: ''},
    species: 'lumberjack',
    color: 'rgba(210, 45, 45, 0.5)',
    movement: 3,
    startAge: 20,
  },

  'bear': {
    maturity: {age: 0, previous: '', next: ''},
    radius: {start: 8.5, end: 8.5, growth: 0},
    spawn: {chance: 0.0, child: ''},
    species: 'bear',
    color: 'rgba(220, 180, 150, 0.8)',
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
  this.canvas = new GridCanvas(this.config);
  this.initializeSimulation();
}

ForestEcosystem.prototype.initializeSimulation = function() {
  this.simulation = new GridSimulation(this.canvas);
  this.population = {
    tree: [],
    lumberjack: [],
    bear: [],
  };
  this.stats = {
    lumber: 0,
    maul: 0,
    revenue: 0,
    expense: 0,
    income: 0,
    score: 0,
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
  this.stats.lumber = 0;
  this.stats.maul = 0;
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
  this.populateList(life);
};

ForestEcosystem.prototype.spawnRandom = function(type) {
  var randPos = this.simulation.randomPosition();
  this.spawnForestLife(type, randPos[0], randPos[1]);
};

ForestEcosystem.prototype.removeForestLife = function(life, index) {
  var species = life.parameters.species;
  var row = life.position[0];
  var col = life.position[1];
  var cellIndex = this.simulation.cellIndex(row, col, life);
  this.simulation.splice(row, col, cellIndex);
  this.population[species].splice(index, 1);
};

ForestEcosystem.prototype.removeRandom = function(species) {
  var population = this.population[species];
  if (population.length > 0) {
    var randIndex = this.simulation.randomInteger(0, population.length);
    var life = population[randIndex];
    this.removeForestLife(life, randIndex);
  }
};

ForestEcosystem.prototype.longLiveHumanity = function() {
  if (this.population.lumberjack <= 0) {
    this.spawnRandom('lumberjack');
  }
};

ForestEcosystem.prototype.longLiveBears = function() {
  if (this.population.bear <= 0) {
    this.spawnRandom('bear');
  }
};

ForestEcosystem.prototype.lumberEvent = function(life, x, y, z) {
  this.simulation.splice(x, y, z);
  this.stats.lumber += life.parameters.score.lumber;
};

ForestEcosystem.prototype.maulEvent = function(x, y, z) {
  this.simulation.splice(x, y, z);
  this.stats.maul += 1;
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

ForestEcosystem.prototype.lumberTracking = function() {
  var lumberCut = this.stats.lumber;
  var lumberjacks = this.population.lumberjack.length;

  // Hire lumberjacks
  if (lumberCut >= lumberjacks * this.config.minLumber) {
    // Prevent infinite loop if lumberjack population is 0
    var hires = (lumberjacks > 0) ? Math.floor(lumberCut / lumberjacks) : 1;
    for (var i=0; i<hires; i++) {
      this.spawnRandom('lumberjack');
    }
  }

  else {
    this.removeRandom('lumberjack');
    this.longLiveHumanity();
  }
};

ForestEcosystem.prototype.maulTracking = function() {
  if (this.stats.maul > this.config.minMaul) {
    this.removeRandom('bear');
  }
  else {
    this.spawnRandom('bear');
  }
};

ForestEcosystem.prototype.calibrateGrid = function() {
  var dimension = this.simulation.getDimensions();
  var grid = this.simulation.getGrid();
  var rows = dimension[0];
  var cols = dimension[1];
  this.clearList(this.population.tree);
  this.clearList(this.population.lumberjack);
  this.clearList(this.population.bear);
  for (var i=0; i<rows; i++) {
    for (var j=0; j<cols; j++) {
      var cell = grid[i][j];
      for (var k=0, len=cell.length; k<len; k++) {
        this.populateList(cell[k]);
      }
    }
  }
};

/*****************************
 * Forest Ecosystem Controls *
 *****************************/
ForestEcosystem.prototype.enableEventHandlers = function() {
  // window.addEventListener('focus', this.simulation.resume.bind(this), false);
  // window.addEventListener('blur', this.simulation.pause.bind(this), false);
  window.addEventListener('keydown', this.enableKeyboardInput.bind(this), false);
};

ForestEcosystem.prototype.enableKeyboardInput = function(event) {
  switch (event.which) {
  case 32: // spacebar
    event.preventDefault();
    this.togglePause();
    break;
  }
};

ForestEcosystem.prototype.togglePause = function() {
  if (this.simulation.isRunning()) {
    this.simulation.pause();
    this.showPaused();
  }
  else {
    this.simulation.resume();
    this.showRunning();
  }
};

ForestEcosystem.prototype.showPaused = function() {
  var element = document.getElementById('simulation-pause');
  element.textContent = 'Paused';
  element.style.color = '#BC3C2C';
};

ForestEcosystem.prototype.showRunning = function() {
  var element = document.getElementById('simulation-pause');
  element.textContent = 'Running';
  element.style.color = '#2CAC2C';
};

ForestEcosystem.prototype.calculateBudget = function() {
  var jacks = this.population.lumberjack.length;
  var lumber = this.stats.lumber;
  var maul = this.stats.maul;
  this.stats.revenue = (2 * lumber);
  this.stats.expense = (5 * jacks) + (10 * maul);
  this.stats.income = this.stats.revenue - this.stats.expense;
  this.stats.score += this.stats.income;
};

ForestEcosystem.prototype.updateStats = function() {
  var yearStat = document.getElementById('simulation-year');
  var monthStat = document.getElementById('simulation-month');
  var jackStat = document.getElementById('simulation-lumberjack');
  var treeStat = document.getElementById('simulation-tree');
  var bearStat = document.getElementById('simulation-bear');
  var lumberStat = document.getElementById('simulation-lumber');
  var maulStat = document.getElementById('simulation-maul');
  var revenueStat = document.getElementById('simulation-revenue');
  var expenseStat = document.getElementById('simulation-expense');
  var incomeStat = document.getElementById('simulation-income');
  var scoreStat = document.getElementById('simulation-score');

  // Calculate stats for DOM elements
  yearStat.textContent = Math.floor(this.simulation.simulation.time / 12);
  monthStat.textContent = this.simulation.simulation.time % 12 + 1;
  jackStat.textContent = this.population.lumberjack.length;
  treeStat.textContent = this.population.tree.length;
  bearStat.textContent = this.population.bear.length;
  lumberStat.textContent = this.stats.lumber;
  maulStat.textContent = this.stats.maul;
  revenueStat.textContent = this.stats.revenue;
  expenseStat.textContent = this.stats.expense;
  incomeStat.textContent = this.stats.income;
  scoreStat.textContent = this.stats.score;

  // Determine color
  incomeStat.style.color = (this.stats.income > 0) ? '#33A933' : '#BC3C2C';
  scoreStat.style.color = (this.stats.score > 0) ? '#33A933' : '#BC3C2C';
};

/****************
 * Main Program *
 ***************/
(function() {

  var CONFIG = {
    // GridSimulation
    canvasID: 'imagination',
    gridRows: 25,
    gridCols: 25,
    delay: 125,

    // Starting population
    treeRatio: 0.5,
    lumberjackRatio: 0.10,
    bearRatio: 0.02,

    // Population control
    minMaul: 6,
    minLumber: 9,
  };

  // Create forest ecosystem
  var forest = new ForestEcosystem(CONFIG);
  forest.enableEventHandlers();
  forest.populateForest();

  /****************************
   * Forest Ecosystem Updater *
   ****************************/
  forest.setUpdater(function() {

    // Get reference to grid
    var grid = forest.simulation.getGrid();
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
    for (i=0, len=forest.population.lumberjack.length; i<len; i++) {
      life = forest.population.lumberjack[i];
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

    // Calibrate population to grid
    forest.calibrateGrid();
    forest.longLiveHumanity();
    forest.longLiveBears();
    forest.calculateBudget();
    forest.updateStats();

    // [Phase 4]: tracking events for new year
    if (forest.simulation.simulation.time % 12 === 0) {
      forest.lumberTracking();
      forest.maulTracking();
      forest.resetYearlyStats();
    }

  });

  forest.startSimulation();
})();
