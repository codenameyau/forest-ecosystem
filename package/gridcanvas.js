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
  // [TODO] Changing size clears canvas
  // canvas.width  = this.settings.gridCols * this.settings.cellSize;
  // canvas.height = this.settings.gridRows * this.settings.cellSize;
  this.ctx = canvas.getContext('2d');
};

/**************************
 * GridCanvas - Utilities *
 **************************/
GridCanvas.prototype.checkProperty = function(object, property, value) {
  if (object && typeof object[property] === 'undefined') {
    object[property] = value;
  }
};

GridCanvas.prototype.drawGrid = function(grid) {
  var cellSize = this.settings.cellSize;
  this.clearCanvas();
  this.ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
  this.ctx.fillStyle = '#9A8A7A';

  for (var i=0; i<grid.length; i++) {
    var cols = grid[i].length;
    for (var j=0; j<cols; j++) {
      if (grid[i][j].length) {
        var occupant = grid[i][j][0];
        var radius = occupant.radius;
        var posX = i*cellSize+this.settings.radius+5;
        var posY = j*cellSize+radius+5;
        this.ctx.fillStyle = occupant.parameters.color;
        this.ctx.moveTo(posX, posY);
        this.ctx.beginPath();
        this.ctx.arc(posX, posY, radius, 0, 2*Math.PI, true);
        this.ctx.stroke();
        this.ctx.fill();
      }
    }
  }
};

GridCanvas.prototype.clearCanvas = function() {
  // Store the current transformation matrix
  this.ctx.save();

  // Use the identity matrix while clearing the canvas
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  // Restore the transform
  this.ctx.restore();
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
    updater: null,
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
GridSimulation.prototype.pause = function() {
  this.simulation.running = false;
};

GridSimulation.prototype.resume = function() {
  this.simulation.running = true;
};

GridSimulation.prototype.togglePause = function() {
  if (this.simulation.running) { this.pause(); }
  else { this.resume(); }
};

GridSimulation.prototype.setUpdater = function(callback) {
  this.simulation.updater = callback;
};

GridSimulation.prototype.update = function(callback) {
  if (this.simulation.running) {
    console.log('running');
    this.canvas.drawGrid(this.grid);
  }
};

GridSimulation.prototype.run = function(callback) {
  window.setInterval(this.update.bind(this), this.canvas.settings.delay);
};

GridSimulation.prototype.populate = function(array) {
  var count = 0;
  for (var i=0; i<this.simulation.rows; i++) {
    for (var j=0; j<this.simulation.cols; j++) {
      if (array[count] !== null) {
        this.grid[i][j].push(array[count]);
      }
      count++;
    }
  }
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

GridSimulation.prototype.randomInteger = function(min, max) {
  return parseInt(Math.random() * (max - min) + min, 10);
};

GridSimulation.prototype.randomPosition = function() {
  return [
    this.randomInteger(0, this.simulation.rows),
    this.randomInteger(0, this.simulation.cols),
  ];
};

GridSimulation.prototype.shuffle = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
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
