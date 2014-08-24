/*!
 * color-sorting.js
 * MIT License (c) 2014
 * codenameyau.github.io
 */

/*-----JSHint-----*/
/* global Color   */
/*----------------*/
'use strict';


/**********************
 * Sorting Algorithms *
 **********************/
var arraySort = function(array, property) {
  array.sort(function(a, b) {
    return a[property] - b[property];
  });
};


/****************
 * Main Program *
 ****************/
(function() {

  // Configuration
  var config = {
    canvas: 'imagination',
    width: 690,
    height: 555,
  };

  // Generate random colors
  var colors = [];
  var cols = 15;
  var rows = 12;
  var squares = cols * rows;
  var size = 30;
  var i, j;
  for (i=0; i<squares; i++) {
    var randColor = new Color('random');
    randColor.computeGrayscale();
    colors.push(randColor);
  }

  // Setup canvas grid
  var canvas = document.getElementById(config.canvas);
  var ctx = canvas.getContext('2d');
  canvas.width = config.width;
  canvas.height = config.height;

  // Perform sort
  arraySort(colors, 'lightness');

  // Draw color squares
  var padding = 15;
  var posX = padding;
  var posY = -size;
  ctx.strokeStyle = '#666666';
  for (i=0; i<squares; i++) {

    // Move to next col
    if (i % cols === 0) {
      posX = padding;
      posY += size + padding;
    }

    // Fill in color square
    var color = colors[i];
    ctx.fillStyle = color.getCSSRGB();
    ctx.fillRect(posX, posY, size, size);
    ctx.strokeRect(posX, posY, size, size);
    posX += size + padding;
  }

})();
