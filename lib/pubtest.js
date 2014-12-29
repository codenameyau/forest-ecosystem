/*!
 * PubTest.js
 * MIT License (c) 2014
 * codenameyau.github.io
 *
 * Description:
 * Client-side tests with modern browser console
 */
'use strict';


/***********************
 * PubTest Constructor *
 ***********************/
function PubTest(name) {
  this.testing = name || 'Test';
  this.cases = {
    total: 0,
    pass: 0,
    fail: 0
  };
  console.time(name);
}


/****************************
 * PubTest - Public Methods *
 ****************************/
PubTest.prototype.results = function() {
  var passColor = (this.cases.pass) ? 'color: #007A00' : 'color: #FE0000';
  var failColor = (this.cases.fail) ? 'color: #FE0000' : 'color: #007A00';
  console.log('%c============', failColor);
  console.log('%cTest Results', failColor);
  console.log('%c============', failColor);
  console.log('%cTotal:  %d', failColor, this.cases.total);
  console.log('%cPassed: %d', passColor, this.cases.pass);
  console.log('%cFailed: %d', failColor, this.cases.fail);
  console.timeEnd(this.testing);
  console.log('');
};

PubTest.prototype.testCase = function(callback) {
  callback();
};


/**********************************
 * PubTest - Expression Assertion *
 **********************************/
PubTest.prototype.assert = function(expr, message) {
  this._addCase(expr, message);
};

PubTest.prototype.assertEqual = function(exprA, exprB, message) {
  var assertion = (exprA === exprB);
  this._addCase(assertion, message);
};

PubTest.prototype.assertNotEqual = function(exprA, exprB, message) {
  var assertion = (exprA !== exprB);
  this._addCase(assertion, message);
};

PubTest.prototype.assertTrue = function(expr, message) {
  var assertion = (expr === true);
  this._addCase(assertion, message);
};

PubTest.prototype.assertFalse = function(expr, message) {
  var assertion = (expr === false);
  this._addCase(assertion, message);
};

PubTest.prototype.assertLess = function(exprA, exprB, message) {
  var assertion = (exprA < exprB);
  this._addCase(assertion, message);
};

PubTest.prototype.assertLessEqual = function(exprA, exprB, message) {
  var assertion = (exprA <= exprB);
  this._addCase(assertion, message);
};

PubTest.prototype.assertGreater = function(exprA, exprB, message) {
  var assertion = (exprA > exprB);
  this._addCase(assertion, message);
};

PubTest.prototype.assertGreaterEqual = function(exprA, exprB, message) {
  var assertion = (exprA >= exprB);
  this._addCase(assertion, message);
};

PubTest.prototype.assertRange = function(value, min, max, message) {
  var assertion = (value >= min && value <= max);
  this._addCase(assertion, message);
};

PubTest.prototype.assertNotRange = function(value, min, max, message) {
  var assertion = (value < min && value > max);
  this._addCase(assertion, message);
};


/****************************
 * PubTest - Type Assertion *
 ****************************/
PubTest.prototype.assertType = function(value, type, message) {
  var assertion = (typeof value === type);
  this._addCase(assertion, message);
};

PubTest.prototype.assertString = function(value, message) {
  this.assertType(value, 'string', message);
};

PubTest.prototype.assertNumber = function(value, message) {
  this.assertType(value, 'number', message);
};

PubTest.prototype.assertBoolean = function(value, message) {
  this.assertType(value, 'boolean', message);
};

PubTest.prototype.assertInteger = function(value, message) {
  var assertion = isNaN(value) ? false : (parseInt(value, 10) === value);
  this._addCase(assertion, message);
};

PubTest.prototype.assertArray = function(value, message) {
  var assertion = (value instanceof Array);
  this._addCase(assertion, message);
};


/****************************
 * PubTest - Data Assertion *
 ****************************/
PubTest.prototype.assertArrayContains = function(array, value, message) {
  var assertion = (array.indexOf(value) < 0) ? false : true;
  this._addCase(assertion, message);
};

PubTest.prototype.assertNotArrayContains = function(array, value, message) {
  var assertion = (array.indexOf(value) < 0) ? true : false;
  this._addCase(assertion, message);
};

PubTest.prototype.assertProperty = function(object, property, message) {
  var assertion = object.hasOwnProperty(property);
  this._addCase(assertion, message);
};


/******************************
 * PubTest - Internal Methods *
 ******************************/
PubTest.prototype._addCase = function(assertion, message) {
  this.cases.total++;
  message = message || 'test case ' + this.cases.total;
  console.assert(assertion, message);
  if (assertion) { this._passed(); }
  else { this._failed(); }
};

PubTest.prototype._passed = function() {
  this.cases.pass++;
};

PubTest.prototype._failed = function() {
  this.cases.fail++;
};
