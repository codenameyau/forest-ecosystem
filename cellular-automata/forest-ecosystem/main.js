/*!
 * Forest Ecosystem
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://redd.it/27h53e
 * http://codegolf.stackexchange.com/q/35322/30051
 */
'use strict';


/****************************
 * GridSimulation - Backend *
 ****************************/
function GridSimulation(settings) {
  this.initializeSettings(settings);
  this.initializeGrid(this.settings.gridSize);
  console.log(this);
}

GridSimulation.prototype.initializeSettings = function(settings) {
  this.settings = settings;
  this.checkProperty(this.settings, 'gridSize', 50);
  this.checkProperty(this.settings, 'cellSize', 5);
};

GridSimulation.prototype.initializeGrid = function(gridSize) {
  this.grid = [];
  for (var i=0; i<gridSize; i++) {
    this.grid[i] = [];
  }
};

GridSimulation.prototype.checkProperty = function(object, property, value) {
  if (object && typeof object[property] === 'undefined') {
    object[property] = value;
  }
};


/******************************
 * GridCanvas - Visualization *
 ******************************/
function GridCanvas(gridObject) {
  this.gridRef = gridObject;
  // this.settings = {
  //   cellSize: config.cellSize,
  //   canvasID: config.canvasID,
  // };
}



/**************************
 * Program Initialization *
 **************************/
(function() {

  // Specify configuration
  var CONFIG = {
    gridSize: 50,
    cellSize: 5,
    canvasID: 'imagination',
  };

  // GridSimulation: handles the backend simulation
  // GridCanvas: visualizes the simulation with canvas
  var simulationGrid = new GridSimulation(CONFIG);
  var simulationCanvas = new GridCanvas(simulationGrid);

})();
