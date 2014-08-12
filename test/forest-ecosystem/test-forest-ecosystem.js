/*---------------JSHint---------------*/
/* global ForestLife, ForestEcosystem */
/* global PubTest                     */
/*------------------------------------*/
'use strict';


(function() {

  // Create PubTest for ForestEcosystem
  var test = new PubTest('ForestEcosystem');
  var CONFIG = {
    // GridSimulation
    canvasID: 'imagination',
    gridRows: 10,
    gridCols: 10,
    cellSize: 15,
    delay: 100,
    radius: 5,

    // Strating population
    treeRatio: 0.5,
    lumberjackRatio: 0.10,
    bearRatio: 0.02,
  };

  // Test Case: grow sapling -> tree -> elder
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);
    var sapling = new ForestLife('sapling');
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
    for (var i=0; i<treeAge; i++) { forest.growLife(sapling); }

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
    for (var j=0; j<nextAge; j++) {forest.growLife(sapling);}

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

  // Test Case: clearList
  test.testCase(function() {
    var clearList = ForestEcosystem.prototype.clearList;
    var demoList = [1, 2, 3, 4, 5];

    test.assertEqual(demoList.length, 5,
      'length of demoList should be 5');

    clearList(demoList);

    test.assertEqual(demoList.length, 0,
      'length of demoList should be 0');
  });

  // Test Case: manageLumberjacks
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);
    var jackPop = 5;
    var i, hires;
    for (i=0; i<jackPop; i++) { forest.spawnRandom('lumberjack'); }

    test.assertEqual(forest.stats.lumberjack, jackPop,
      'number of lumberjacks should be ' + jackPop);

    test.assertEqual(forest.stats.lumber.year, 0,
      'number of lumber collected should be 0');

    // Case 1: lumber exceeds population -> hires
    forest.stats.lumber.year = 10;
    hires = Math.floor(forest.stats.lumber.year / jackPop);
    forest.manageLumberjacks();
    jackPop += hires;

    test.assertEqual(forest.stats.lumberjack, jackPop,
      'number of lumberjack should be increased due to hires');

    // Case 2: lumber less than population -> lay offs
    forest.stats.lumber.year = 2;
    forest.manageLumberjacks();
    jackPop -= 1;

    test.assertEqual(forest.stats.lumberjack, jackPop,
      'number of lumberjack should be one less due to layoff');
  });

  // Report test results
  test.results();

})();
