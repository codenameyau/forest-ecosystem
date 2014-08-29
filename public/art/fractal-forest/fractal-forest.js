/*!
 * fractal-forest.js
 * codenameyau.github.io
 *
 * Challenge Description:
 * http://codegolf.stackexchange.com/q/35835
 */
'use strict';

var drawFractalTree = function(ctx) {
  var x = 200;
  var y = 200;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (var i=0, stop=8*Math.PI; i<stop; i+=0.5) {
    x += 20;
    y -= 20*Math.sin(i);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
};

(function() {
  // Setup canvas element
  var canvas = document.getElementById('imagination');
  var ctx = canvas.getContext('2d');
  var width = window.innerWidth;
  var height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width;
  canvas.style.height = height;

  // Define context settings
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 2;

  drawFractalTree(ctx);
})();
