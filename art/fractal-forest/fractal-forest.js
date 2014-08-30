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
  data.data[index + 3] = color[3] || 1;
};

var updateCanvas = function(ctx, data) {
  ctx.putImageData(data, 0, 0);
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

var drawRandomForest = function(ctx) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var data = ctx.getImageData(0, 0, width, height);
  fillPixel(data, 200, 200, [100, 0, 0]);
  updateCanvas(ctx, data);
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

  // Define context settings
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2;

  // drawFractalTree(ctx);
  drawRandomForest(ctx);
})();
