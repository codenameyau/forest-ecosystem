/*!
 * ColorJS
 * MIT License (c) 2014
 * codenameyau.github.io
 *
 * Description:
 * Color manipulation tools
 */
'use strict';


/*********************
 * Color Constructor *
 *********************/
function Color(type, value) {
  this.setDefaultColor();

  switch (type) {

  case 'hex':
    this.parseHex(value);
    break;

  case 'csshex':
    this.parseCSSHex(value);
    break;

  case 'rgb':
    this.parseRGB(value);
    break;

  case 'cssrgb':
    this.parseCSSRGB(value);
    break;

  }
}

Color.prototype.setDefaultColor = function() {
  this.rgb = {
    red: 255,
    green: 255,
    blue: 255
  };
};

/****************************
 * Color Constructor Parser *
 ****************************/
Color.prototype.parseHex = function(value) {
  var hexString = value.toString(16);

};

Color.prototype.parseCSSHex = function(value) {

};

Color.prototype.parseRGB = function(value) {

};

Color.prototype.parseCSSRGB = function(value) {

};

/************************
 * Color Public Methods *
 ************************/
Color.prototype.hexToRGB = function(stringHex) {

};
