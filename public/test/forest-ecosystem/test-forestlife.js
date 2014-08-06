/*---------------JSHint---------------*/
/* global ForestLife, PubTest         */
/*------------------------------------*/
'use strict';


(function() {

  // ForestLife tests
  var test = new PubTest('ForestLife');

  //  Create all possible ForestLife
  var sapling = new ForestLife('sapling');
  var tree = new ForestLife('tree');
  var elder = new ForestLife('elder');
  var lumberjack = new ForestLife('lumberjack');
  var bear = new ForestLife('bear');

  // Test Case: maturity age
  test.testCase(function() {
    test.assertEqual(sapling.maturityAge, 12, 'maturity age of sapling should be 12');
    test.assertEqual(tree.maturityAge, 120, 'maturity age of tree should be 120');
    test.assertEqual(elder.maturityAge, 0, 'maturity age of elder should be 0');
    test.assertEqual(lumberjack.maturityAge, 0, 'maturity age of lumberjack should be 0');
    test.assertEqual(bear.maturityAge, 0, 'maturity age of bear should be 0');
  });

  // Test Case: spawn child
  test.testCase(function() {
    test.assertEqual(sapling.spawnChild, '', 'spawn child of sapling should be empty');
    test.assertEqual(tree.spawnChild, 'sapling', 'spawn child of tree should be sapling');
    test.assertEqual(elder.spawnChild, 'sapling', 'spawn child of elder should be sapling');
    test.assertEqual(lumberjack.spawnChild, '', 'spawn child of lumberjack should be empty');
    test.assertEqual(bear.spawnChild, '', 'spawn child of bear should be empty');
  });

  // Test Case: spawn child probability
  test.testCase(function() {
    test.assertEqual(sapling.spawnProbability, 0.0, 'spawn probability of sapling should be 0.0');
    test.assertEqual(tree.spawnProbability, 0.1, 'spawn probability of tree should be 0.1');
    test.assertEqual(elder.spawnProbability, 0.2, 'spawn probability of elder should be 0.2');
    test.assertEqual(lumberjack.spawnProbability, 0.0, 'spawn probability of lumberjack should be 0.0');
    test.assertEqual(bear.spawnProbability, 0.0, 'spawn probability of bear should be 0.0');
  });

  // Test Case: movement
  test.testCase(function() {
    test.assertEqual(sapling.movement, 0, 'movement of sapling should be 0');
    test.assertEqual(tree.movement, 0, 'movement of tree should be 0');
    test.assertEqual(elder.movement, 0, 'movement of elder should be 0');
    test.assertEqual(lumberjack.movement, 3, 'movement of lumberjack should be 3');
    test.assertEqual(bear.movement, 5, 'movement of bear should be 5');
  });

  // Report test results
  test.results();

})();
