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
  this.initializeEventHandlers();
}

GridSimulation.prototype.initializeSettings = function(settings) {
  this.settings = settings;
  this.checkProperty(this.settings, 'gridSize', 50);
  this.checkProperty(this.settings, 'cellSize', 5);
  this.checkProperty(this.settings, 'running', true);
};

GridSimulation.prototype.initializeGrid = function(gridSize) {
  this.grid = [];
  for (var i=0; i<gridSize; i++) {
    this.grid[i] = [];
  }
};

GridSimulation.prototype.initializeEventHandlers = function() {
  window.addEventListener('focus', this.resume.bind(this), false);
  window.addEventListener('blur', this.pause.bind(this), false);
  window.addEventListener('keydown', this._keyboardInputHandler.bind(this), false);
};

GridSimulation.prototype.checkProperty = function(object, property, value) {
  if (object && typeof object[property] === 'undefined') {
    object[property] = value;
  }
};

GridSimulation.prototype.pause = function() {
  this.settings.running = false;
  console.info('Paused');
};

GridSimulation.prototype.resume = function() {
  this.settings.running = true;
  console.info('Resuming');
};

GridSimulation.prototype.togglePause = function() {
  if (this.settings.running) { this.pause(); }
  else { this.resume(); }
};

GridSimulation.prototype._keyboardInputHandler = function(event) {
  switch (event.which) {

  case 32: // spacebar
    this.togglePause();
    break;

  }
};

/******************************
 * GridCanvas - Visualization *
 ******************************/
function GridCanvas(gridObject) {
  this.gridRef = gridObject;
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
