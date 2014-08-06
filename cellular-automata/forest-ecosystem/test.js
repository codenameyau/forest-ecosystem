/*!
 * Forest Ecosystem Simulation
 * codenameyau.github.io
 */

/*---------------JSHint---------------*/
/* global GridCanvas, GridSimulation  */
/* global ForestLife, PubTest         */
/*------------------------------------*/
'use strict';

(function() {

  var test = new PubTest();
  console.log(test);
  // Test GridCanvas
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
  test.assertEqual(CONFIG, 1, 'Same');

  // Report test results
  test.results();

})();
