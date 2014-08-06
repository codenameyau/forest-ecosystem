/*!
 * PubTest
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
  name = name || 'PubTest';
  this.running = false;
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
  console.log('');
  console.log('============');
  console.log('Test Results');
  console.log('============');
  console.log('Total:  %d', this.cases.total);
  console.log('Passed: %d', this.cases.pass);
  console.warn('Failed: %d', this.cases.fail);
  console.timeEnd(this.testing);
};

PubTest.prototype.clear = function() {
  console.clear();
};


/************************
 * PubTest - Assertions *
 ************************/
PubTest.prototype.assert = function(expr, message) {
  console.assert(expr, message);
};

PubTest.prototype.assertEqual = function(exprA, exprB, message) {
  var assertion = (exprA === exprB);
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
