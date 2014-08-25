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
var sortByProperty = function(array, property) {
  array.sort(function(a, b) {
    return a[property] - b[property];
  });
};

var sortByColorRatio = function(array, index) {
  array.sort(function(a, b) {
    var sumA = a.rgb[0] + a.rgb[1] + a.rgb[2];
    var sumB = b.rgb[0] + b.rgb[1] + b.rgb[2];
    var colorA = (sumA > 0) ? a.rgb[index] / sumA : 0;
    var colorB = (sumB > 0) ? b.rgb[index] / sumB : 0;
    return colorA - colorB;
  });
};

var sortByMinDistance = function(array) {
  array.sort(function(a, b) {
    var distA = a.rgb[0] + Math.abs(a.rgb[1] - 255) + Math.abs(a.rgb[2] - 255);
    var distB = b.rgb[0] + Math.abs(b.rgb[1] - 255) + Math.abs(b.rgb[2] - 255);
    return distA - distB;
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
  // sortByProperty(colors, 'lightness');
  sortByColorRatio(colors, [1]);
  // sortByMinDistance(colors);

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
