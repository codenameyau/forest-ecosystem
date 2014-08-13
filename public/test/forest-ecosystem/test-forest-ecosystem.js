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
    gridRows: 20,
    gridCols: 20,
    delay: 125,

    // Strating population
    treeRatio: 0.5,
    lumberjackRatio: 0.10,
    bearRatio: 0.02,
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

  // Test Case: removeRandom
  test.testCase(function() {
    var forest = new ForestEcosystem(CONFIG);
    var jackPop = 5;
    for (var i=0; i<jackPop; i++) { forest.spawnRandom('lumberjack'); }

    test.assertEqual(forest.stats.lumberjack, jackPop,
      'number of lumberjacks should be ' + jackPop);

    forest.removeRandom('lumberjack');
    jackPop -= 2;

    test.assertEqual(forest.stats.lumberjack, jackPop,
      'number of lumberjacks should be one less');
  });

  // Test Case: lumberTracking
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
    forest.lumberTracking();
    jackPop += hires;

    test.assertEqual(forest.stats.lumberjack, jackPop,
      'number of lumberjack should be increased due to hires');

    // Case 2: lumber less than population -> lay offs
    forest.stats.lumber.year = 2;
    forest.lumberTracking();
    jackPop -= 1;

    test.assertEqual(forest.stats.lumberjack, jackPop,
      'number of lumberjack should be one less due to layoff');
  });

  // Report test results
  test.results();

})();
