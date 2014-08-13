/*---------------JSHint---------------*/
/* global GridCanvas, GridSimulation  */
/* global PubTest                     */
/*------------------------------------*/
'use strict';


(function() {

  var CONFIG = {
    // GridSimulation
    canvasID: 'imagination',
    gridRows: 20,
    gridCols: 20,
    delay: 125,

    // Strating population
    treeRatio: 0.5,
    lumberjackRatio: 0.10,
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

  // Test Case: cellLength
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();
    demo.spawn('A', 0, 0);
    demo.spawn('B', 0, 0);
    demo.spawn('C', 0, 0);

    testSimulation.assertEqual(demo.cellLength(0, 0), 3,
      'length of cell in position (0, 0) should be 3');
  });

  // Test Case: getCell
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();
    var cellContent = demo.getCell(0, 0);

    testSimulation.assertEqual(cellContent.length, 0,
      'length of cell Array should be 0');

    demo.spawn('A', 0, 0);
    demo.spawn('B', 0, 0);
    cellContent = demo.getCell(0, 0);

    testSimulation.assertEqual(cellContent.length, 2,
      'length of cell Array should be 2');

    testSimulation.assertEqual(cellContent[0], 'A',
      'value in index 0 should be A');

    testSimulation.assertEqual(cellContent[1], 'B',
      'value in index 1 should be B');
  });

  // Test Case: cellIndex
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();
    demo.spawn('A', 0, 0);
    demo.spawn('B', 0, 0);
    demo.spawn('C', 0, 0);

    testSimulation.assertEqual(grid[0][0].length, 3,
      'length of cell in position (0, 0) should be 3');

    testSimulation.assertEqual(demo.cellIndex(0, 0, 'A'), 0,
      'index of A in cell should be 0');

    testSimulation.assertEqual(demo.cellIndex(0, 0, 'B'), 1,
      'index of B in cell should be 1');

    testSimulation.assertEqual(demo.cellIndex(0, 0, 'C'), 2,
      'index of C in cell should be 2');
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

  // Test Case: spawn
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();

    testSimulation.assertEqual(grid[0][0].length, 0,
      'length of cell in position (0, 0) should be 0');

    testSimulation.assertEqual(grid[0][1].length, 0,
      'length of cell in position (0, 1) should be 0');

    testSimulation.assertEqual(grid[1][0].length, 0,
      'length of cell in position (1, 0) should be 0');

    demo.spawn('A', 0, 0);
    demo.spawn('B', 0, 0);
    demo.spawn('C', 0, 1);
    demo.spawn('D', 1, 0);

    testSimulation.assertEqual(grid[0][0].length, 2,
      'length of cell in position (0, 0) should be 2');

    testSimulation.assertEqual(grid[0][1].length, 1,
      'length of cell in position (0, 1) should be 0');

    testSimulation.assertEqual(grid[1][0].length, 1,
      'length of cell in position (1, 0) should be 0');

    testSimulation.assertEqual(grid[0][0][0], 'A',
      'value of cell in first index should be A');

    testSimulation.assertEqual(grid[0][0][1], 'B',
      'value of cell in second index should be B');
  });

  // Test Case: move
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();

    // Sample values
    demo.spawn('A', 0, 0);
    demo.spawn('B', 0, 0);
    demo.spawn('C', 0, 0);

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
      'value of third element in cell should still be C');

    // Move: top left corner -> right
    demo.move(0, 0, 0, 0, 1);

    testSimulation.assertEqual(grid[0][0].length, 2,
      'length of original cell is 2');

    testSimulation.assertEqual(grid[0][1].length, 1,
      'length of right cell should be 1');

    testSimulation.assertEqual(grid[0][0][0], 'B',
      'value of original cell should be B');

    testSimulation.assertEqual(grid[0][0][1], 'C',
      'value of bottom cell should contain C');

    testSimulation.assertEqual(grid[0][1][0], 'A',
      'value of right cell should contains A');

    // Move: move again to right
    demo.move(0, 1, 0, 0, 2);

    testSimulation.assertEqual(grid[0][1].length, 0,
      'length of right cell should be 0');

    testSimulation.assertEqual(grid[0][2][0], 'A',
      'value of right cell should contains A');

    // Move: top left corner -> bottom
    demo.move(0, 0, 1, 1, 0);

    testSimulation.assertEqual(grid[0][0].length, 1,
      'length of original cell is 1');

    testSimulation.assertEqual(grid[1][0].length, 1,
      'length of bottom cell should be 1');

    testSimulation.assertEqual(grid[1][0][0], 'C',
      'value of bottom cell should be C');

    // Move: does not move if out of bounds
    var rows = demo.simulation.rows-1;
    var cols = demo.simulation.cols-1;
    demo.spawn('D', rows, cols);
    demo.spawn('E', rows, cols);
    demo.move(0, 0, 0, -1, -1);
    demo.move(rows, cols, 0, 100, 100);

    testSimulation.assertEqual(grid[0][0].length, 1,
      'length of top left corner should still be 1');

    testSimulation.assertEqual(grid[rows][cols].length, 2,
      'length of bottom right cell should be 2');

    testSimulation.assertEqual(grid[rows][cols][0], 'D',
      'value of cell in first index should be D');
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

  // Test Case: unoccupied
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();

    testSimulation.assertTrue(demo.unoccupied(0, 0),
      'value of unoccupied should be true');

    demo.spawn('A', 0, 0);

    testSimulation.assertFalse(demo.unoccupied(0, 0),
      'value of unoccupied should be false');
  });

  // Test Case: getOpenSpace8
  testSimulation.testCase(function() {
    var demo = new GridSimulation(canvas);
    var grid = demo.getGrid();
    var rows = simulation.simulation.rows-1;
    var cols = simulation.simulation.cols-1;

    // Sample values
    demo.spawn('A', 0, 0);
    demo.spawn('B', 0, 1);
    demo.spawn('C', 0, 2);
    demo.spawn('D', 1, 1);
    demo.spawn('E', 2, 1);
    demo.spawn('F', rows, cols);

    // Test openspace of A
    var openspaceA = demo.getOpenSpace8(0, 0);
    testSimulation.assertEqual(openspaceA.length, 1,
      'length of openspace for A should be 1');

    // Test openspace of D
    var openspaceD = demo.getOpenSpace8(1, 1);
    testSimulation.assertEqual(openspaceD.length, 4,
      'length of openspace for D should be 4');

    // Test openspace of F
    var openspaceF = demo.getOpenSpace8(rows, cols);
    testSimulation.assertEqual(openspaceF.length, 3,
      'length of openspace for F should be 3');

    testSimulation.assertArrayContains(grid[0][0], 'A',
      'assert that grid contains A');
  });

  // Report testSimulation results
  testSimulation.results();
})();
