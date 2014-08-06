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
  name = name || 'Test';
  this.testing = name;
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
  console.log('');
  console.log('%c============', failColor);
  console.log('%cTest Results', failColor);
  console.log('%c============', failColor);
  console.log('%cTotal:  %d', failColor, this.cases.total);
  console.log('%cPassed: %d', passColor, this.cases.pass);
  console.log('%cFailed: %d', failColor, this.cases.fail);
  console.timeEnd(this.testing);
};

PubTest.prototype.clear = function() {
  console.clear();
};

PubTest.prototype.testCase = function(callback) {
  callback();
};

/***********************************
 * PubTest - Expression Assertions *
 ***********************************/
PubTest.prototype.assert = function(expr, message) {
  this._addCase(expr);
  console.assert(expr, message);
};

PubTest.prototype.assertEqual = function(exprA, exprB, message) {
  var assertion = (exprA === exprB);
  this._addCase(assertion);
  console.assert(assertion, message);
};

PubTest.prototype.assertNotEqual = function(exprA, exprB, message) {
  var assertion = (exprA !== exprB);
  this._addCase(assertion);
  console.assert(assertion, message);
};

PubTest.prototype.assertRange = function(value, min, max, message) {
  var assertion = (value >= min && value <= max);
  this._addCase(assertion);
  console.assert(assertion, message);
};


/*****************************
 * PubTest - Type Assertions *
 *****************************/
PubTest.prototype.assertInteger = function(value, message) {
  var assertion = isNaN(value) ? false : (parseInt(value, 10) === value);
  this._addCase(assertion);
  console.assert(assertion, message);
};


/******************************
 * PubTest - Internal Methods *
 ******************************/
PubTest.prototype._addCase = function(assertion) {
  this.cases.total++;
  if (assertion) { this._passed(); }
  else { this._failed(); }
};

PubTest.prototype._passed = function() {
  this.cases.pass++;
};

PubTest.prototype._failed = function() {
  this.cases.fail++;
};
