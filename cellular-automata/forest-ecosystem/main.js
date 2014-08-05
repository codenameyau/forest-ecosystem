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
function ForestLife(type) {
  this.initializeProperties();

  switch (this.lifeType) {

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

ForestLife.prototype.initializeProperties = function() {
  this.age = 0;
  this.movement = 0;
  this.spawnProbability = 0.0;
  this.spawnChild = '';
};

ForestLife.prototype.initializeSaplingTree = function() {
  this.lifeID = 0;
  this.lifeType = 'sapling';
};

ForestLife.prototype.initializeTree = function() {
  this.lifeID = 1;
  this.lifeType = 'tree';
  this.spawnProbability = 0.1;
  this.spawnChild = 'sapling';
};

ForestLife.prototype.initializeElderTree = function() {
  this.lifeID = 2;
  this.lifeType = 'elder';
  this.spawnProbability = 0.2;
  this.spawnChild = 'sapling';
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
  };

  // Lumberjack Object
  var jack = new ForestLife('lumberjack');

  // GridCanvas: visualizes the simulation with canvas
  // GridSimulation: handles the backend simulation
  var simulationCanvas = new GridCanvas(CONFIG);
  var simulation = new GridSimulation(simulationCanvas);
  var grid = simulation.getGrid();

  // Generate forest ecosystem
  // Start: 10% lumberjacks, 50% trees, 2% bears

  console.log(simulation);
  // simulation.run();

})();
