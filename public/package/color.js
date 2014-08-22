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
  switch (type) {

  case 'hex':
    this.parseHex(value);
    break;

  case 'csshex':
    this.parseCSSHex(value);
    break;

  case 'cssrgb':
    this.parseCSSRGB(value);
    break;

  default:
    this.setDefaultColor();
  }
}

Color.prototype.setDefaultColor = function() {
  this.hex = 0xFFFFFF;
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

};

Color.prototype.parseCSSHex = function(value) {

};

Color.prototype.parseRGB = function(value) {

};

Color.prototype.parseCSSRGB = function(value) {

};
