/*!
 * GridCanvas Simulation
 * MIT License (c) 2014
 * codenameyau.github.io
 *
 * Description:
 * Grid simulation tool with canvas renderer
 */
'use strict';


/******************************
 * GridCanvas - Visualization *
 ******************************/
function GridCanvas(config) {
  this.initializeSettings(config);
  this.initializeCanvas();
}

GridCanvas.prototype.initializeSettings = function(settings) {
  this.settings = settings;
  this.checkProperty(this.settings, 'gridRows', 50);
  this.checkProperty(this.settings, 'gridCols', 50);
  this.checkProperty(this.settings, 'cellSize', 5);
  this.checkProperty(this.settings, 'delay', 500);
  this.checkProperty(this.settings, 'running', true);
};

GridCanvas.prototype.initializeCanvas = function() {
  var canvas = document.getElementById(this.settings.canvasID);
  canvas.width  = this.settings.gridCols * this.settings.cellSize;
  canvas.height = this.settings.gridRows * this.settings.cellSize;
  this.ctx = canvas.getContext('2d');
};

/**************************
 * GridCanvas - Utilities *
 **************************/
GridCanvas.prototype.drawGrid = function(grid) {
  this.ctx.strokeStyle = 'rgb(30, 30, 30)';
  var radius = 4;
  var cellSize = 10;
  for (var i=0; i<grid.length; ++i) {
    var rows = grid[i].length;
    for (var j=0; j<rows; ++j) {
      var posX = i*cellSize+this.settings.radius+1;
      var posY = j*cellSize+radius+1;
      this.ctx.moveTo(posX, posY);
      this.ctx.beginPath();
      this.ctx.arc(posX, posY, radius, 0, 2*Math.PI, true);
      this.ctx.stroke();
    }
  }
};

GridCanvas.prototype.checkProperty = function(object, property, value) {
  if (object && typeof object[property] === 'undefined') {
    object[property] = value;
  }
};



/******************************
 * GridSimulation Constructor *
 ******************************/
function GridSimulation(canvas) {
  this.canvas = canvas;
  this.initializeGrid();
  this.initializeSimulation();
  this.initializeEventHandlers();
}

GridSimulation.prototype.initializeGrid = function() {
  var gridRows = this.canvas.settings.gridRows;
  var gridCols = this.canvas.settings.gridCols;
  this.grid = [];
  for (var i=0; i<gridCols; i++) {
    this.grid[i] = [];
    for (var j=0; j<gridRows; j++) {
      this.grid[i][j] = [];
    }
  }
};

GridSimulation.prototype.initializeSimulation = function() {
  this.simulation = {
    size: this.canvas.settings.gridRows * this.canvas.settings.gridCols,
    rows: this.canvas.settings.gridRows,
    cols: this.canvas.settings.gridCols,
    running: false,
    time: 0,
  };
};

GridSimulation.prototype.initializeEventHandlers = function() {
  window.addEventListener('focus', this.resume.bind(this), false);
  window.addEventListener('blur', this.pause.bind(this), false);
  window.addEventListener('keydown', this._keyboardInputHandler.bind(this), false);
};

/*****************************
 * GridSimulation - Controls *
 *****************************/
GridSimulation.prototype.update = function() {
  console.log('Updating');
};

GridSimulation.prototype.pause = function() {
  this.simulation.running = false;
  console.info('Paused');
};

GridSimulation.prototype.resume = function() {
  this.simulation.running = true;
  console.info('Resuming');
};

GridSimulation.prototype.togglePause = function() {
  if (this.simulation.running) { this.pause(); }
  else { this.resume(); }
};

GridSimulation.prototype.run = function() {
  this.canvas.drawGrid(this.grid);
  console.info('Running');
};

/******************************
 * GridSimulation - Utilities *
 ******************************/
GridSimulation.prototype.getGrid = function() {
  return this.grid;
};

GridSimulation.prototype.getSize = function() {
  return this.simulation.size;
};

GridSimulation.prototype.randomNumber = function(min, max) {
  return Math.random() * (max - min) + min;
};

GridSimulation.prototype.randomPosition = function() {
  return [
    parseInt(this.randomNumber(0, this.simulation.rows), 10),
    parseInt(this.randomNumber(0, this.simulation.cols), 10),
  ];
};

/*****************************
 * GridSimulation - Internal *
 *****************************/
GridSimulation.prototype._keyboardInputHandler = function(event) {
  switch (event.which) {

  case 32: // spacebar
    this.togglePause();
    break;

  }
};
