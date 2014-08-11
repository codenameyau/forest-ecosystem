/*---------------JSHint---------------*/
/* global ForestLife, ForestEcosystem */
/* global PubTest                     */
/*------------------------------------*/
'use strict';


(function() {

  // Create PubTest for ForestEcosystem
  var test = new PubTest('ForestEcosystem');

  // // Test Case: grow sapling -> tree -> elder
  // test.testCase(function() {
  //   var sapling = new ForestLife('sapling');
  //   test.assertEqual(sapling.age, 0,
  //     'age of the sapling should be 0');

  //   test.assertEqual(sapling.parameters.maturity.next, 'tree',
  //     'next stage of the sapling should be tree');

  //   test.assertEqual(sapling.parameters.spawn.child, '',
  //     'spawn child of the sapling should be empty');

  //   test.assertEqual(sapling.parameters.spawn.chance, 0,
  //     'spawn chance of the sapling should be 0');

  //   // [Stage 1] Grow for 12 months -> mature to 'tree'
  //   var treeAge = sapling.parameters.maturity.age;
  //   var treeRadius = sapling.parameters.radius.end;
  //   for (var i=0; i<treeAge; i++) { sapling.grow(); }

  //   // Tests that sapling is now a tree
  //   test.assertEqual(sapling.age, 12,
  //     'age of the sapling should be 12');

  //   test.assertEqual(sapling.type, 'tree',
  //     'type of the sapling should now be tree');

  //   test.assertEqual(sapling.radius, treeRadius,
  //     'radius of the sapling should now be the starting radius of tree');

  //   test.assertEqual(sapling.parameters.maturity.previous, 'sapling',
  //     'previous stage of the sapling should be sapling');

  //   test.assertEqual(sapling.parameters.maturity.next, 'elder',
  //     'next stage of the sapling should be elder');

  //   test.assertEqual(sapling.parameters.spawn.child, 'sapling',
  //     'spawn child of the sapling should be sapling');

  //   test.assertEqual(sapling.parameters.spawn.chance, 0.1,
  //     'spawn chance of the sapling should be 0.1');

  //   // [Stage 2] Grow for 100 more months -> mature to 'elder' tree
  //   var nextAge = sapling.parameters.maturity.age - treeAge;
  //   var elderRadius = sapling.parameters.radius.end;
  //   for (var j=0; j<nextAge; j++) {sapling.grow();}

  //   // Tests that sapling is now a elder
  //   test.assertEqual(sapling.age, 120,
  //     'age of the sapling should be 120');

  //   test.assertEqual(sapling.type, 'elder',
  //     'type of the sapling should now be elder');

  //   test.assertEqual(sapling.radius, elderRadius,
  //     'radius of the sapling should now be the starting radius of elder');

  //   test.assertEqual(sapling.parameters.maturity.previous, 'tree',
  //     'previous stage of the sapling should be tree');

  //   test.assertEqual(sapling.parameters.maturity.next, '',
  //     'next stage of the sapling should be none');

  //   test.assertEqual(sapling.parameters.spawn.child, 'sapling',
  //     'spawn child of the sapling should be sapling');

  //   test.assertEqual(sapling.parameters.spawn.chance, 0.2,
  //     'spawn chance of the sapling should be 0.2');
  // });


  // Report test results
  test.results();

})();
