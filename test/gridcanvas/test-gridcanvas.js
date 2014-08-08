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

    testSimulation.assertEqual(simulation.grid.length, CONFIG.gridRows,
      'number of grid elements should match the number of rows');

    testSimulation.assertEqual(simulation.grid[0].length, CONFIG.gridCols,
      'number of grid elements should match the number of cols');
  });

  // Test Case: getSize
  testSimulation.testCase(function() {
    testSimulation.assertEqual(simulation.getSize(), CONFIG.gridRows * CONFIG.gridCols,
      'grid size should be rows x cols');
  });

  // Test Case: randomNumber
  testSimulation.testCase(function() {
    var randInt = GridSimulation.prototype.randomInteger;

    testSimulation.assertInteger(randInt(1, 5),
      'random number should be an integer');

    testSimulation.assertInteger(randInt(-10.2, 10.5),
      'random number should be an integer');

    testSimulation.assertRange(randInt(0, 10), 0, 10,
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

  // Test Case: shuffle
  testSimulation.testCase(function() {
    var shuffle = GridSimulation.prototype.shuffle;
    var testArray = [1, 2, 3, 4, 5];
    var testLength = testArray.length;
    shuffle(testArray);

    testSimulation.assertEqual(testArray.length, testLength,
      'length of shuffled array should be the same as original');
  });

  // Test Case: populate
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var population = [];
    for (var i=0; i<demo.simulation.size; i++) {population.push(i);}
    demo.populate(population);

    // Tests that all cells are filled
    var filled = true;
    for (var row=0; row<CONFIG.gridRows; row++) {
      for (var col=0; col<CONFIG.gridCols; col++) {
        if (demo.grid[row][col].length === 0) {
          filled = false;
        }
      }
    }

    testSimulation.assertEqual(filled, true,
      'cells of simulation grid should be filled');
  });

  // Test Case: move8
  testSimulation.testCase(function() {

  });

  // Test Case: checkNeighbor8
  testSimulation.testCase(function() {

  });


  // Report testSimulation results
  testSimulation.results();

})();
