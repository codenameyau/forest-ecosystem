/*!
 * fractal-forest.js
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://codegolf.stackexchange.com/q/35835
 */
'use strict';

/********************
 * Canvas Utilities *
 ********************/
var fillPixel = function(data, x, y, color) {
  var index = (x + y * data.width) * 4;
  data.data[index + 0] = color[0];
  data.data[index + 1] = color[1];
  data.data[index + 2] = color[2];
  data.data[index + 3] = color[3] || 255;
};

var saveCanvasData = function(ctx, data) {
  ctx.putImageData(data, 0, 0);
};

var randomNumber = function(min, max) {
  return parseInt(Math.random() * (max - min) + min, 10);
};

/**************************
 * Black and White Forest *
 **************************/
var drawFractalTree = function(ctx) {
  var x = 200;
  var y = 200;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (var i=0, stop=8*Math.PI; i<stop; i+=0.5) {
    x += 20;
    y -= 20*Math.cos(i);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
};

var drawBasicForest = function(ctx) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var data = ctx.createImageData(width, height);

  // Tree parameters
  var numTrees = 20;
  var leftBound = 20;
  var rightBound = width - leftBound;
  var x, y, h;

  // Draw trees as vertical line
  for (var i=0; i<numTrees; i++) {
    y = 400 - (i*10);
    x = randomNumber(leftBound, rightBound);
    h = 200 - i*20;

    // Draw vertical lines
    var colorR = randomNumber(0, 200);
    var colorG = randomNumber(0, 200);
    var colorB = randomNumber(0, 200);
    for (var j=y, treeHeight=y+h; j<treeHeight; j++) {
      fillPixel(data, x, j, [colorR, colorG, colorB]);
    }
  }
  saveCanvasData(ctx, data);
};

var drawRandomForest = function(ctx) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var data = ctx.createImageData(width, height);
  for (var i=0; i<200; i++) {
    fillPixel(data, 200, i, [100, 0, 0]);
  }
  saveCanvasData(ctx, data);
};

/****************
 * Main Program *
 ****************/
(function() {
  // Setup canvas element
  var canvas = document.getElementById('imagination');
  var ctx = canvas.getContext('2d');
  var width = 800;
  var height = 600;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width;
  canvas.style.height = height;
  drawBasicForest(ctx);

})();