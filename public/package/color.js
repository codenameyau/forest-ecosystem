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

  case 'random':
    this.setRandomColor();
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
  var rgb = this.hexToRGB( value.toString(16) );
  this.rgb.red   = rgb[0];
  this.rgb.green = rgb[1];
  this.rgb.blue  = rgb[2];
};

Color.prototype.parseCSSHex = function(value) {
  this.parseHex( value.slice(1, 7) );
};

Color.prototype.parseRGB = function(value) {
  this.rgb.red   = value[0];
  this.rgb.green = value[1];
  this.rgb.blue  = value[2];
};

Color.prototype.parseCSSRGB = function(value) {
  var colors = value.match(/\d{1,3}/g);
  this.rgb.red   = parseInt(colors[0], 10);
  this.rgb.green = parseInt(colors[1], 10);
  this.rgb.blue  = parseInt(colors[2], 10);
};

Color.prototype.setRandomColor = function() {
  this.rgb.red   = this.randomNumber(0, 256);
  this.rgb.green = this.randomNumber(0, 256);
  this.rgb.blue  = this.randomNumber(0, 256);
};

/************************
 * Color Public Methods *
 ************************/
Color.prototype.hexToRGB = function(stringHex) {
  stringHex = stringHex.toLowerCase();
  return [
    this._hexChannelValue(stringHex, 0, 2),
    this._hexChannelValue(stringHex, 2, 4),
    this._hexChannelValue(stringHex, 4, 6),
  ];
};

Color.prototype.getHex = function(cssflag) {
  var hex = (cssflag === true) ? '#' : '';
  hex += this.rgb.red.toString(16);
  hex += this.rgb.green.toString(16);
  hex += this.rgb.blue.toString(16);
  return hex;
};

Color.prototype.randomNumber = function(min, max) {
  return parseInt(Math.random() * (max - min) + min, 10);
};

/**************************
 * Color Internal Methods *
 **************************/
Color.prototype._hexChannelValue = function(stringHex, start, end) {
  return parseInt( stringHex.slice(start, end), 16 );
};
