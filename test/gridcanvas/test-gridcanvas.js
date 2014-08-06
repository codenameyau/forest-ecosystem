/*---------------JSHint---------------*/
/* global GridCanvas, GridSimulation  */
/* global PubTest                     */
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
  var simulation = new GridSimulation(canvas);


  /**************************
  * Test Suite: GridCanvas *
  **************************/
  var testCanvas = new PubTest('GridCanvas');

  // Test Case: initialization
  testCanvas.testCase(function() {
    testCanvas.assertEqual(CONFIG, canvas.settings,
      'matching settings for GridCanvas');
  });

  // Report testCanvas results
  testCanvas.results();


  /*****************************
  * Test Suite: GridSimulation *
  ******************************/
  var testSimulation = new PubTest('GridSimulation');

  // Test Case: initialization
  testSimulation.testCase(function() {
    testSimulation.assertEqual(canvas, simulation.canvas,
      'simulation canvas should match canvas');
  });

  // Test Case: getSize
  testSimulation.testCase(function() {
    testSimulation.assertEqual(simulation.getSize(), 100,
      'grid size should be rows x cols');
  });

  // Test Case: randomNumber
  testSimulation.testCase(function() {
    var min = 0, max = 10;
    var randInt = simulation.randomInteger(min, max);

    testSimulation.assertInteger(randInt,
      'random number should be an integer');

    testSimulation.assertRange(randInt, min, max,
      'range of random number should be between min and max');
  });

  // Test Case: randomPosition
  testSimulation.testCase(function() {
    var randPosition = simulation.randomPosition();

    testSimulation.assertArray(randPosition,
      'random position should be an Array');

    testSimulation.assertEqual(randPosition.length, 2,
      'length of random position should be 2');

    testSimulation.assertRange(randPosition[0], 0, CONFIG.gridRows,
      'x position should be between 0 and number of rows');

    testSimulation.assertRange(randPosition[0], 0, CONFIG.gridCols,
      'y position should be between 0 and number of cols');
  });

  // Report testSimulation results
  testSimulation.results();

})();
