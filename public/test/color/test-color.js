/*---------------JSHint---------------*/
/* global PubTest, Color              */
/*------------------------------------*/
'use strict';

(function() {

  // Create test suite for Color
  var test = new PubTest('Color');

  // Test Case: blank constructor
  test.testCase(function() {
    var color = new Color();

    // Color default should be white
    test.assertEqual(color.hex, 'FFFFFF',
      'hex value of color should be FFFFFF');

    test.assertEqual(color.red, 255,
      'red value of color should be 255');

    test.assertEqual(color.green, 255,
      'green value of color should be 255');

    test.assertEqual(color.blue, 255,
      'blue value of color should be 255');

  });

})();
