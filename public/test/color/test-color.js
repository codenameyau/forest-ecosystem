/*---------------JSHint---------------*/
/* global PubTest, Color              */
/*------------------------------------*/
'use strict';

(function() {

  // Create test suite for Color
  var test = new PubTest('Color');
  var globalColor = new Color();

  // Test Case: blank constructor
  test.testCase(function() {
    var color = new Color();

    // Color default should be white
    test.assertEqual(color.rgb.red, 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb.green, 255,
      'green value of color should be 255');

    test.assertEqual(color.rgb.blue, 255,
      'blue value of color should be 255');
  });

  // Test Case: hexToRGB
  test.testCase(function() {
    var upper = globalColor.hexToRGB('FF250A');
    var lower = globalColor.hexToRGB('ff250a');

    test.assertArray(upper,
      'data type of rgb result should be an array');

    test.assertArray(lower,
      'data type of rgb result should be an array');

    test.assertEqual(upper[0], 255,
      'value of red channel should be 255');

    test.assertEqual(upper[1], 37,
      'value of green channel should be 37');

    test.assertEqual(upper[2], 10,
      'value of blue channel should be 10');

    test.assertEqual(upper[0], lower[0],
      'values of red channel should be equal');

    test.assertEqual(upper[1], lower[1],
      'values of green channel should be equal');

    test.assertEqual(upper[2], lower[2],
      'values of blue channel should be equal');
  });

  // Test Case: hex constructor
  test.testCase(function() {
    var color = new Color('hex', 0xFF0000);

    test.assertEqual(color.rgb.red, 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb.green, 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb.blue, 0,
      'blue value of color should be 0');
  });

  // Test Case: csshex constructor
  test.testCase(function() {
    var color = new Color('csshex', '#FF0000');

    test.assertEqual(color.rgb.red, 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb.green, 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb.blue, 0,
      'blue value of color should be 0');
  });

  // Test Case: rgb constructor
  test.testCase(function() {
    var color = new Color('rgb', [255, 0, 0]);

    test.assertEqual(color.rgb.red, 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb.green, 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb.blue, 0,
      'blue value of color should be 0');
  });

  // Test Case: cssrgb constructor
  test.testCase(function() {
    var color = new Color('cssrgb', 'rgb(255, 0, 0)');

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
