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

  console.log(sapling);

  // Test Case: maturity age
  test.testCase(function() {
    test.assertEqual(sapling.parameters.maturity.age, 12,
      'maturity age of sapling should be 12');

    test.assertEqual(tree.parameters.maturity.age, 120,
      'maturity age of tree should be 120');

    test.assertEqual(elder.parameters.maturity.age, 0,
      'maturity age of elder should be 0');

    test.assertEqual(lumberjack.parameters.maturity.age, 0,
      'maturity age of lumberjack should be 0');

    test.assertEqual(bear.parameters.maturity.age, 0,
      'maturity age of bear should be 0');
  });

  // Test Case: spawn child
  test.testCase(function() {
    test.assertEqual(sapling.parameters.spawn.child, '',
      'spawn child of sapling should be blank');

    test.assertEqual(tree.parameters.spawn.child, 'sapling',
      'spawn child of tree should be sapling');

    test.assertEqual(elder.parameters.spawn.child, 'sapling',
      'spawn child of elder should be sapling');

    test.assertEqual(lumberjack.parameters.spawn.child, '',
      'spawn child of lumberjack should be blank');

    test.assertEqual(bear.parameters.spawn.child, '',
      'spawn child of bear should be blank');
  });

  // Test Case: spawn child probability
  test.testCase(function() {
    test.assertEqual(sapling.parameters.spawn.chance, 0.0,
      'spawn probability of sapling should be 0.0');

    test.assertEqual(tree.parameters.spawn.chance, 0.1,
      'spawn probability of tree should be 0.1');

    test.assertEqual(elder.parameters.spawn.chance, 0.2,
      'spawn probability of elder should be 0.2');

    test.assertEqual(lumberjack.parameters.spawn.chance, 0.0,
      'spawn probability of lumberjack should be 0.0');

    test.assertEqual(bear.parameters.spawn.chance, 0.0,
      'spawn probability of bear should be 0.0');
  });

  // Test Case: movement
  test.testCase(function() {
    test.assertEqual(sapling.parameters.movement, 0,
      'movement of sapling should be 0');

    test.assertEqual(tree.parameters.movement, 0,
      'movement of tree should be 0');

    test.assertEqual(elder.parameters.movement, 0,
      'movement of elder should be 0');

    test.assertEqual(lumberjack.parameters.movement, 3,
      'movement of lumberjack should be 3');

    test.assertEqual(bear.parameters.movement, 5,
      'movement of bear should be 5');
  });

  // Report test results
  test.results();

})();
