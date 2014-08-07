/*---------------JSHint---------------*/
/* global ForestLife, PubTest         */
/*------------------------------------*/
'use strict';


(function() {

  // Create PubTest for ForestLife
  var test = new PubTest('ForestLife');

  //  Create all possible ForestLife
  var definitions = ForestLife.prototype.definition;
  var sapling = new ForestLife('sapling');
  var tree = new ForestLife('tree');
  var elder = new ForestLife('elder');
  var lumberjack = new ForestLife('lumberjack');
  var bear = new ForestLife('bear');

  // Test Case: parameters match defintions
  test.testCase(function() {
    test.assertEqual(sapling.parameters, definitions.sapling,
      'parameters of sapling should match definition of sapling');

    test.assertEqual(tree.parameters, definitions.tree,
      'parameters of tree should match definition of tree');

    test.assertEqual(elder.parameters, definitions.elder,
      'parameters of elder should match definition of elder');

    test.assertEqual(lumberjack.parameters, definitions.lumberjack,
      'parameters of lumberjack should match definition of lumberjack');

    test.assertEqual(bear.parameters, definitions.bear,
      'parameters of bear should match definition of bear');
  });

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

  // Test Case: grow sapling -> tree -> elder
  test.testCase(function() {
    var sapling = new ForestLife('sapling');

    // Test parameters before growing
    test.assertEqual(sapling.age, 0,
      'age of the sapling should be 0');

    test.assertEqual(sapling.parameters.maturity.next, 'tree',
      'next stage of the sapling should be tree');

    test.assertEqual(sapling.parameters.spawn.child, '',
      'spawn child of the sapling should be empty');

    test.assertEqual(sapling.parameters.spawn.chance, 0,
      'spawn chance of the sapling should be 0');

    // [Stage 1] Grow for 12 months -> mature to 'tree'
    var treeAge = sapling.parameters.maturity.age;
    var treeRadius = sapling.parameters.radius.end;
    for (var i=0; i<treeAge; i++) { sapling.grow(); }

    // Tests that sapling is now a tree
    test.assertEqual(sapling.age, 12,
      'age of the sapling should be 12');

    test.assertEqual(sapling.type, 'tree',
      'type of the sapling should now be tree');

    test.assertEqual(sapling.radius, treeRadius,
      'radius of the sapling should now be the starting radius of tree');

    test.assertEqual(sapling.parameters.maturity.previous, 'sapling',
      'previous stage of the sapling should be sapling');

    test.assertEqual(sapling.parameters.maturity.next, 'elder',
      'next stage of the sapling should be elder');

    test.assertEqual(sapling.parameters.spawn.child, 'sapling',
      'spawn child of the sapling should be sapling');

    test.assertEqual(sapling.parameters.spawn.chance, 0.1,
      'spawn chance of the sapling should be 0.1');

    // [Stage 2] Grow for 100 more months -> mature to 'elder' tree
    var nextAge = sapling.parameters.maturity.age - treeAge;
    var elderRadius = sapling.parameters.radius.end;
    for (var j=0; j<nextAge; j++) {sapling.grow();}

    // Tests that sapling is now a elder
    test.assertEqual(sapling.age, 120,
      'age of the sapling should be 120');

    test.assertEqual(sapling.type, 'elder',
      'type of the sapling should now be elder');

    test.assertEqual(sapling.radius, elderRadius,
      'radius of the sapling should now be the starting radius of elder');

    test.assertEqual(sapling.parameters.maturity.previous, 'tree',
      'previous stage of the sapling should be tree');

    test.assertEqual(sapling.parameters.maturity.next, '',
      'next stage of the sapling should be none');

    test.assertEqual(sapling.parameters.spawn.child, 'sapling',
      'spawn child of the sapling should be sapling');

    test.assertEqual(sapling.parameters.spawn.chance, 0.2,
      'spawn chance of the sapling should be 0.2');
  });


  // Report test results
  test.results();

})();
