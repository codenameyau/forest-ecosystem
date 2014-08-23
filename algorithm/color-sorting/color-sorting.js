/*!
 * color-sorting.js
 * MIT License (c) 2014
 * codenameyau.github.io
 */

/*-----JSHint-----*/
/* global Color   */
/*----------------*/
'use strict';


(function() {

  // Configuration
  var config = {
    canvas: 'imagination',
    width: 500,
    height: 500,
    size: 10,
  };

  // Generate random colors
  var colors = [];
  var squares = 10;
  var i, j;
  for (i=0; i<squares; i++) {
    colors.push(new Color('random'));
  }

  // Setup canvas grid
  var canvas = document.getElementById(config.canvas);
  var ctx = canvas.getContext('2d');
  canvas.width = config.width;
  canvas.height = config.height;

  // Draw color squares
  // for (i=0; i<squares; i++) {
  //   var color = colors[i];
  //   ctx.fillStyle = color.getCSSRGB();
  // }

  // Draw something
  ctx.fillStyle = 'rgb(200, 0, 0)';
  ctx.fillRect(0, 0, 50, 50);

  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  ctx.fillRect(30, 30, 50, 50);


})();
