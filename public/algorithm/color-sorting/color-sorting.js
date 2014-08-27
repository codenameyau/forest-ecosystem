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
var sortByLightness = function(array) {
  array.sort(function(a, b) {
    return a.lightness - b.lightness;
  });
};

var sortByDarkness = function(array) {
  array.sort(function(a, b) {
    return b.lightness - a.lightness;
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

var sortByDistance = function(array, i, j, k) {
  array.sort(function(a, b) {
    var distA = (a.rgb[i] - a.rgb[j] - a.rgb[k]) / 255;
    var distB = (b.rgb[i] - b.rgb[j] - b.rgb[k]) / 255;
    return distA - distB;
  });
};

var sortByTint = function(array, index) {
  array.sort(function(a, b) {
    var distA = (a.rgb[0] - a.rgb[index] - a.rgb[0]) / 255;
    var distB = (b.rgb[0] - b.rgb[index] - b.rgb[0]) / 255;
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
    width: 725,
    height: 605,
  };

  // Configuration
  var cols = 36;
  var rows = 30;
  var size = 15;
  var padding = 5;

  // Generate random colors
  var squares = cols * rows;
  var colors = [];
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
  // sortByLightness(colors);
  // sortByDarkness(colors);
  // sortByColorRatio(colors, 0);
  // sortByColorRatio(colors, 1);
  // sortByColorRatio(colors, 2);
  // sortByDistance(colors, 2, 0, 1);
  // sortByTint(colors, 0);
  // sortByTint(colors, 1);
  sortByTint(colors, 2);

  // Draw color squares
  var posX = padding;
  var posY = -size;
  ctx.strokeStyle = '#AAAAAA';
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
