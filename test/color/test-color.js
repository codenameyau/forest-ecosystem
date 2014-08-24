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
    test.assertEqual(color.rgb[0], 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb[1], 255,
      'green value of color should be 255');

    test.assertEqual(color.rgb[2], 255,
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

    test.assertEqual(color.rgb[0], 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb[1], 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb[2], 0,
      'blue value of color should be 0');
  });

  // Test Case: csshex constructor
  test.testCase(function() {
    var color = new Color('csshex', '#FF0000');

    test.assertEqual(color.rgb[0], 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb[1], 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb[2], 0,
      'blue value of color should be 0');
  });

  // Test Case: rgb constructor
  test.testCase(function() {
    var color = new Color('rgb', [255, 0, 0]);

    test.assertEqual(color.rgb[0], 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb[1], 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb[2], 0,
      'blue value of color should be 0');
  });

  // Test Case: cssrgb constructor
  test.testCase(function() {
    var color = new Color('cssrgb', 'rgb(255, 0, 0)');

    test.assertEqual(color.rgb[0], 255,
      'red value of color should be 255');

    test.assertEqual(color.rgb[1], 0,
      'green value of color should be 0');

    test.assertEqual(color.rgb[2], 0,
      'blue value of color should be 0');
  });

  // Test Case: getHex
  test.testCase(function() {
    var color = new Color('rgb', [255, 255, 255]);
    var hex = color.getHex();
    var csshex = color.getHex(true);

    test.assertEqual(hex, 'ffffff',
      'value of getHex should be ffffff');

    test.assertEqual(csshex, '#ffffff',
      'value of getHex with argument true should contain hash');
  });

  // Test Case: setRandomColor
  test.testCase(function() {
    var color = new Color('random');

    test.assertRange(color.rgb[0], 0, 255,
      'value of red should be between 0 and 255 for random color');

    test.assertRange(color.rgb[1], 0, 255,
      'value of green should be between 0 and 255 for random color');

    test.assertRange(color.rgb[2], 0, 255,
      'value of blue should be between 0 and 255 for random color');
  });

  // Test Case: getCSSRGB
  test.testCase(function() {
    var color = new Color('csshex', '#ffff00');

    test.assertEqual(color.getCSSRGB(), 'rgb(255,255,0)',
      'value of getCSSRGB should match css rgb string');
  });

  // Test Case: computeGrayscale
  test.testCase(function() {
    var color = new Color('rgb', [255, 255, 255]);

    test.assertEqual(color.lightness, null,
      'value of color lightness should be null by default');

    color.computeGrayscale();

    test.assertEqual(color.lightness, 255,
      'value of color lightness should be 255');
  });

  // Show test results
  test.results();

})();
