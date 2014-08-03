/*!
 * Forest Ecosystem
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://redd.it/27h53e
 * http://codegolf.stackexchange.com/q/35322/30051
 */
'use strict';


/********************
 * Grid Constructor *
 ********************/
function Grid(size) {
  this.initializeGrid(size);
}

Grid.prototype.initializeGrid = function(gridSize) {
  this.grid = [];
  for (var i=0; i<gridSize; i++) {
    this.grid[i] = [];
  }
};



/***************************
 * Main Program Simulation *
 ***************************/
(function() {

  // Specify configuration
  var CONFIG = {
    numCells: 50,
    cellSize: 5,
    canvasID: 'imagination',
  };

  // Setup canvas grid
  var canvas = document.getElementById(CONFIG.canvasID);
  var ctx = canvas.getContext('2d');
  var PI = Math.PI;

  // Specify life
  var A = new Grid(CONFIG.numCells);
  console.log(A);
})();
