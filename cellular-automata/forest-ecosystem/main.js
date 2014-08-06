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
  this.initializeProperties(lifetype);

  switch (lifetype) {

  case 'sapling':
    this.initializeSaplingTree();
    break;
  case 'tree':
    this.initializeTree();
    break;
  case 'elder':
    this.initializeElderTree();
    break;
  case 'lumberjack':
    this.initializeLumberJack();
    break;
  case 'bear':
    this.initializeBear();
    break;

  }
}

ForestLife.prototype.initializeProperties = function(lifetype) {
  this.type = lifetype;
  this.age = 0;
  this.maturityAge = 0;
  this.movement = 0;
  this.spawnProbability = 0.0;
  this.spawnChild = '';
};

ForestLife.prototype.initializeSaplingTree = function() {
  this.maturityAge = 12;
};

ForestLife.prototype.initializeTree = function() {
  this.spawnProbability = 0.1;
  this.spawnChild = 'sapling';
  this.maturityAge = 120;
};

ForestLife.prototype.initializeElderTree = function() {
  this.spawnProbability = 0.2;
  this.spawnChild = 'sapling';
};

ForestLife.prototype.initializeLumberJack = function() {
  this.movement = 3;
};

ForestLife.prototype.initializeBear = function() {
  this.movement = 5;
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
    cellSize: 10,
    delay: 1000,
    radius: 5,
    treeRatio: 0.5,
    lumberjackRatio: 0.1,
    bearRatio: 0.02,
  };

  // GridCanvas: visualizes the simulation
  // GridSimulation: handles the backend simulation
  var simulationCanvas = new GridCanvas(CONFIG);
  var simulation = new GridSimulation(simulationCanvas);
  var grid = simulation.getGrid();

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

  // Generate starting forest ecosystem from ratio
  var randX, randY;
  for (var i=simulation.size-1; i>=0; i--) {
  }

  console.log(simulation);
  // simulation.run();

})();
