/*---------------JSHint---------------*/
/* global GridCanvas, GridSimulation  */
/* global PubTest                     */
/*------------------------------------*/
'use strict';


(function() {

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

  // Setup GridCanvas and GridSimulation to test
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

  // Test Case: validPosition
  testSimulation.testCase(function() {
    testSimulation.assertTrue(simulation.validPosition(0, 0),
      'position of top left cell should be a valid position');

    testSimulation.assertTrue(simulation.validPosition(5, 5),
      'position of center cell should be a valid position');

    testSimulation.assertTrue(simulation.validPosition(CONFIG.gridRows-1, CONFIG.gridCols-1),
      'position of bottom right cell should be a valid position');

    testSimulation.assertFalse(simulation.validPosition(-1, 0),
      'position of negative row cell should not be a valid position');

    testSimulation.assertFalse(simulation.validPosition(0, -1),
      'position of negative col cell should not be a valid position');

    testSimulation.assertFalse(simulation.validPosition(CONFIG.gridRows, 0),
      'position of out of range row cell should not be a valid position');

    testSimulation.assertFalse(simulation.validPosition(0, CONFIG.gridCols),
      'position of out of range col cell should not be a valid position');
  });

  // Test Case: differentCell
  testSimulation.testCase(function() {
    testSimulation.assertFalse(simulation.differentCell(0, 0, 0, 0),
      'value of different cell should be false');

    testSimulation.assertFalse(simulation.differentCell(1, 0, 1, 0),
      'value of different cell should be false');

    testSimulation.assertTrue(simulation.differentCell(0, 0, 1, 0),
      'value of different cell should be true');

    testSimulation.assertTrue(simulation.differentCell(0, 0, 0, 1),
      'value of different cell should be true');
  });

  // Test Case: move
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();

    // Sample values
    grid[0][0].push('A');
    grid[0][0].push('B');
    grid[0][0].push('C');

    // Move: does not move if same cell
    demo.move(0, 0, 0, 0, 0);
    demo.move(0, 0, 1, 0, 0);

    testSimulation.assertEqual(grid[0][0].length, 3,
      'length of cell should still be 3');

    testSimulation.assertEqual(grid[0][0][0], 'A',
      'value of first element in cell should still be A');

    testSimulation.assertEqual(grid[0][0][1], 'B',
      'value of second element in cell should still be B');

    testSimulation.assertEqual(grid[0][0][2], 'C',
      'value of second element in cell should still be C');

    // Move: top left corner -> 1 space right
    demo.move(0, 0, 0, 0, 1);
    demo.move(0, 0, 1, 1, 0);

    testSimulation.assertEqual(grid[0][0].length, 1,
      'length of original cell is 1');

    testSimulation.assertEqual(grid[0][1].length, 1,
      'length of right cell should be 1');

    testSimulation.assertEqual(grid[1][0].length, 1,
      'length of bottom cell should be 1');

    testSimulation.assertEqual(grid[0][0][0], 'B',
      'value of original cell should be B');

    testSimulation.assertEqual(grid[0][1][0], 'A',
      'value of right cell should contains A');

    testSimulation.assertEqual(grid[1][0][0], 'C',
      'value of bottom cell should contain C');

    // Move: does not move if out of bounds
    var rows = demo.simulation.rows-1;
    var cols = demo.simulation.cols-1;
    grid[rows][cols].push('D');
    demo.move(0, 0, 0, -1, -1);
    demo.move(rows, cols, 0, 100, 100);

    testSimulation.assertEqual(grid[0][0].length, 1,
      'length of top left corner should still be 1');

    testSimulation.assertEqual(grid[rows][cols].length, 1,
      'length of bottom right cell should still be 1');
  });

  // Test Case: getNeighbor8
  testSimulation.testCase(function() {
    var rows = simulation.simulation.rows-1;
    var cols = simulation.simulation.cols-1;

    // Neighbors to check
    var topLeftN = simulation.getNeighbor8(0, 0);
    var bottomLeftN = simulation.getNeighbor8(rows, 0);
    var leftN = simulation.getNeighbor8(1, 0);
    var centerN = simulation.getNeighbor8(1, 1);
    var topRightN = simulation.getNeighbor8(0, cols);
    var bottomRightN = simulation.getNeighbor8(rows, cols);
    var rightN = simulation.getNeighbor8(1, cols);

    // Check contents of neighbors
    testSimulation.assertArray(centerN,
      'type of neighbors should be Array');

    testSimulation.assertArray(centerN[0],
      'type of content of neighbors should be Array');

    testSimulation.assertEqual(centerN[0].length, 2,
      'length of content of neighbor should be 2');

    // Check length of neighbors
    testSimulation.assertEqual(topLeftN.length, 3,
      'length of neighbors for top left position should be 3');

    testSimulation.assertEqual(bottomLeftN.length, 3,
      'length of neighbors for bottom left position should be 3');

    testSimulation.assertEqual(leftN.length, 5,
      'length of neighbors for left position should be 5');

    testSimulation.assertEqual(centerN.length, 8,
      'length of neighbors for center position should be 8');

    testSimulation.assertEqual(topRightN.length, 3,
      'length of neighbors for top right position should be 3');

    testSimulation.assertEqual(bottomRightN.length, 3,
      'length of neighbors for bottom right position should be 3');

    testSimulation.assertEqual(rightN.length, 5,
      'length of neighbors for right position should be 5');
  });


  // Report testSimulation results
  testSimulation.results();
})();
