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

var clearCanvas = function(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/****************
 * Main Program *
 ****************/
(function() {

  // Setup canvas grid
  var canvasID = 'imagination';
  var canvas = document.getElementById(canvasID);
  var ctx = canvas.getContext('2d');
  var PI = Math.PI;

  // Specify configuration
  var grid = {
    cellSize: 5,
    numCells: 100,
  };

  // Canvas settings
  ctx.imageSmoothingEnabled = false;

  // Draw something
  ctx.fillStyle = 'rgb(200, 0, 0)';
  ctx.fillRect(0, 0, 50, 50);

  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  ctx.fillRect(30, 30, 50, 50);
  ctx.save();

  // Draw triangles
  ctx.beginPath();
  ctx.moveTo(75, 50);
  ctx.lineTo(100, 75);
  ctx.lineTo(100, 25);
  ctx.fill();

  // Draw smiley face
  // arc(x, y, radius, startAngle, endAngle, antiClockwise)
  ctx.restore();
  ctx.strokeStyle = 'rgb(30, 30, 30)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.arc(160, 80, 50, 0, 2*PI, true);  // face
  ctx.moveTo(150, 70);
  ctx.arc(145, 70, 5, 0, 2*PI, true);   // left eye
  ctx.moveTo(180, 70);
  ctx.arc(175, 70, 5, 0, 2*PI, true);   // right eye
  ctx.moveTo(190, 85);
  ctx.arc(160, 85, 30, 0, PI, false);   // smile
  ctx.stroke();

})();
