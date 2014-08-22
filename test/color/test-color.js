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
    test.assertEqual(color.hex, 0xFFFFFF,
      'hex value of color should be 0xFFFFFF');

    test.assertEqual(color.rgb.red, 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb.green, 255,
      'green value of color should be 255');

    test.assertEqual(color.rgb.blue, 255,
      'blue value of color should be 255');
  });

  // Test Case: hex constructor
  test.testCase(function() {
    var color = new Color('hex', 0xFF0000);

    test.assertEqual(color.hex, 0xFF0000,
      'hex value of color should be 0xFF0000');

    test.assertEqual(color.rgb.red, 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb.green, 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb.blue, 0,
      'blue value of color should be 0');
  });


  // Show test results
  test.results();

})();
