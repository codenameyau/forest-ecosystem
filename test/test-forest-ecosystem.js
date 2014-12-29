/*---------------JSHint---------------*/
/* global ForestEcosystem             */
/* global PubTest                     */
/*------------------------------------*/
'use strict';


(function() {

  // Create PubTest for ForestEcosystem
  var test = new PubTest('ForestEcosystem');
  var CONFIG = {
    // GridSimulation
    canvasID: 'imagination',
    gridRows: 25,
    gridCols: 25,
    delay: 125,

    // Starting population
    treeRatio: 0.5,
    lumberjackRatio: 0.10,
    bearRatio: 0.05,

    // Population control
    minMaul: 5,
    minLumber: 7,
  };

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

  // Test Case: spawnForestLife
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);

    test.assertEqual(forest.population.tree.length, 0,
      'length of starting tree population should be 0');

    test.assertEqual(forest.population.lumberjack.length, 0,
      'length of starting lumberjack population should be 0');

    test.assertEqual(forest.population.bear.length, 0,
      'length of starting bear population should be 0');

    forest.spawnForestLife('sapling', 0, 0);
    forest.spawnForestLife('tree', 0, 1);
    forest.spawnForestLife('elder', 0, 2);
    forest.spawnForestLife('lumberjack', 1, 0);
    forest.spawnForestLife('bear', 1, 1);

    test.assertEqual(forest.population.tree.length, 3,
      'length of tree population should be 3');

    test.assertEqual(forest.population.lumberjack.length, 1,
      'length of lumberjack population should be 1');

    test.assertEqual(forest.population.bear.length, 1,
      'length of bear population should be 1');
  });

  // Test Case: removeForestLife
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);
    forest.spawnForestLife('sapling', 0, 0);
    forest.spawnForestLife('tree', 0, 1);
    forest.spawnForestLife('tree', 0, 2);
    forest.spawnForestLife('elder', 0, 3);
    forest.spawnForestLife('lumberjack', 1, 0);
    forest.spawnForestLife('lumberjack', 1, 1);
    forest.spawnForestLife('bear', 2, 0);
    forest.spawnForestLife('bear', 2, 1);

    test.assertEqual(forest.population.tree.length, 4,
      'length of tree population should be 4');

    test.assertEqual(forest.population.lumberjack.length, 2,
      'length of lumberjack population should be 2');

    test.assertEqual(forest.population.bear.length, 2,
      'length of bear population should be 2');

    test.assertEqual(forest.population.tree[0].type, 'sapling',
      'type of first element in tree population should be sapling');

    forest.removeForestLife(forest.population.tree[0], 0);
    forest.removeForestLife(forest.population.lumberjack[0], 0);
    forest.removeForestLife(forest.population.bear[0], 0);

    test.assertEqual(forest.population.tree.length, 3,
      'length of tree population should be 3');

    test.assertEqual(forest.population.lumberjack.length, 1,
      'length of lumberjack population should be 1');

    test.assertEqual(forest.population.bear.length, 1,
      'length of bear population should be 1');

    test.assertEqual(forest.population.tree[0].type, 'tree',
      'type of first element in tree population should be tree');

  });

  // Test Case: removeRandom
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);
    var jackPop = 5;
    for (var i=0; i<jackPop; i++) { forest.spawnRandom('lumberjack'); }

    test.assertEqual(forest.population.lumberjack.length, jackPop,
      'number of lumberjacks should be ' + jackPop);

    forest.removeRandom('lumberjack');
    jackPop--;

    test.assertEqual(forest.population.lumberjack.length, jackPop,
      'number of lumberjacks should be one less');
  });

  // Test Case: moveForestLife
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);
    forest.spawnForestLife('lumberjack', 2, 2);
    var lumberjack = forest.population.lumberjack[0];

    test.assertEqual(lumberjack.position[0], 2,
      'position x of lumberjack should be 2');

    test.assertEqual(lumberjack.position[1], 2,
      'position y of lumberjack should be 2');

    forest.moveForestLife(lumberjack);

    test.assert(lumberjack.position[0] !== 2 || lumberjack.position[1] !== 2,
      'position of lumberjack should have changed');

    test.assertRange(lumberjack.position[0], 1, 3,
      'position x of lumberjack should have only changed by at most 1');

    test.assertRange(lumberjack.position[1], 1, 3,
      'position y of lumberjack should have only changed by at most 1');
  });

  // Test Case: lumberTracking
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);

    // Case: lumberjack population at least 1 after lumberTracking
    test.assertEqual(forest.population.lumberjack.length, 0,
      'population of lumberjack should be 0');

    forest.lumberTracking();

    test.assertEqual(forest.population.lumberjack.length, 1,
      'population of lumberjack should have increased by 1');

    // Case: lay off 1 lumberjack if quota not met
    for (var i=0; i<5; i++) { forest.spawnRandom('lumberjack'); }
    forest.stats.lumber.year = 0;

    test.assertEqual(forest.population.lumberjack.length, 6,
      'population of lumberjack should be 6');

    forest.lumberTracking();
    test.assertEqual(forest.stats.lumber, 0,
      'number of lumber collected this year should be 0');

    test.assertEqual(forest.population.lumberjack.length, 5,
      'number of lumberjack should be one less due to layoff');

    // Case: more lumberjack hired if passes quota
    forest.stats.lumber = 200;
    forest.lumberTracking();

    test.assert(forest.population.lumberjack.length > 6,
      'population of lumberjack should be greater than 6');
  });

  // Test Case: maulTracking
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);
    for (var i=0; i<5; i++) {
      forest.spawnRandom('bear');
    }

    test.assertEqual(forest.population.bear.length, 5,
      'population of bear should be 5');

    // Case: bear should spawn if 0 mauls this year
    forest.stats.maul.year = 0;
    forest.maulTracking();

    test.assertEqual(forest.population.bear.length, 6,
      'population of bear should be 6');
  });

  // Report test results
  test.results();

})();
