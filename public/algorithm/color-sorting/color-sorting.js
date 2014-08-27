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
  var grayscale = false;
  var colors = [];
  var colorRange = {
    red:   [10, 250],
    green: [10, 250],
    blue:  [10, 250]
  };

  // Setup canvas grid
  var canvas = document.getElementById(config.canvas);
  var ctx = canvas.getContext('2d');
  canvas.width = config.width;
  canvas.height = config.height;

  // Pops all elements in array
  var clearArray = function(array) {
    while (array.length) { array.pop(); }
  };

  // Generates array of random colors
  var randomizeColors = function() {
    clearArray(colors);
    for (var i=0; i<squares; i++) {
      var randColor = new Color('random', colorRange);
      randColor.computeGrayscale();
      colors.push(randColor);
    }
  };

  // Draw color squares
  var drawColors = function(colors, grayscale) {
    var posX = padding;
    var posY = -size;
    ctx.strokeStyle = '#AAAAAA';
    for (var i=0; i<squares; i++) {

      // Move to next col
      if (i % cols === 0) {
        posX = padding;
        posY += size + padding;
      }

      // Fill in color square
      var color = colors[i];
      ctx.fillStyle = (grayscale) ? color.getCSSGrayscale() : color.getCSSRGB();
      ctx.fillRect(posX, posY, size, size);
      ctx.strokeRect(posX, posY, size, size);
      posX += size + padding;
    }
  };

  // Generate colors
  randomizeColors();
  drawColors(colors, grayscale);

  // Event listeners
  document.getElementById('sort-grayscale').addEventListener('click', function() {
    grayscale = (grayscale === true) ? false : true;
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-lightness').addEventListener('click', function() {
    sortByLightness(colors);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-darkness').addEventListener('click', function() {
    sortByDarkness(colors);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-red-ratio').addEventListener('click', function() {
    sortByColorRatio(colors, 0);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-green-ratio').addEventListener('click', function() {
    sortByColorRatio(colors, 1);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-blue-ratio').addEventListener('click', function() {
    sortByColorRatio(colors, 2);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-red-distance').addEventListener('click', function() {
    sortByDistance(colors, 0, 0, 0);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-green-distance').addEventListener('click', function() {
    sortByDistance(colors, 1, 1, 1);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-blue-distance').addEventListener('click', function() {
    sortByDistance(colors, 2, 2, 2);
    drawColors(colors, grayscale);
  });

  document.getElementById('sort-randomize').addEventListener('click', function() {
    randomizeColors();
    drawColors(colors, grayscale);
  });

})();
