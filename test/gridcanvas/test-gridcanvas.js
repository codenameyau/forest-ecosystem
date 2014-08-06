/*---------------JSHint---------------*/
/* global GridCanvas, PubTest         */
/*------------------------------------*/
'use strict';


(function() {

  // Create GridCanvas
  var CONFIG = {
    canvasID: 'imagination',
    gridRows: 10,
    gridCols: 10,
    cellSize: 10,
    delay: 1000,
    radius: 5,
    treeRatio: 0.5,
    lumberjackRatio: 0.1,
    bearRatio: 0.02,
  };
  var canvas = new GridCanvas(CONFIG);

  // Begin test cases
  var test = new PubTest('GridCanvas');
  test.assert(CONFIG === canvas.settings, 'Matching settings for GridCanvas');

  // Report test results
  test.results();

})();
