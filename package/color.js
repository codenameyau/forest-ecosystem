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
    this.setRandomColor(value);
    break;
  }
}

Color.prototype.setDefaultColor = function() {
  this.rgb = [255, 255, 255];
  this.lightness = null;
};

/****************************
 * Color Constructor Parser *
 ****************************/
Color.prototype.parseHex = function(value) {
  this.rgb = this.hexToRGB( value.toString(16) );
};

Color.prototype.parseCSSHex = function(value) {
  this.parseHex( value.slice(1, 7) );
};

Color.prototype.parseRGB = function(value) {
  this.rgb = value;
};

Color.prototype.parseCSSRGB = function(value) {
  var colors  = value.match(/\d{1,3}/g);
  this.rgb[0] = parseInt(colors[0], 10);
  this.rgb[1] = parseInt(colors[1], 10);
  this.rgb[2] = parseInt(colors[2], 10);
};

Color.prototype.setRandomColor = function(value) {
  var redRange = value.red;
  var greenRange = value.green;
  var blueRange = value.blue;
  this.rgb[0] = this.randomNumber(redRange[0], redRange[1]);
  this.rgb[1] = this.randomNumber(greenRange[0], greenRange[1]);
  this.rgb[2] = this.randomNumber(blueRange[0], blueRange[1]);
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
  hex += this.rgb[0].toString(16);
  hex += this.rgb[1].toString(16);
  hex += this.rgb[2].toString(16);
  return hex;
};

Color.prototype.getCSSRGB = function() {
  return 'rgb(' + this.rgb.join(',') + ')';
};

Color.prototype.getCSSGrayscale = function() {
  var gray = this.lightness;
  return 'rgb(' + gray + ',' + gray + ',' + gray + ')';
};

Color.prototype.computeGrayscale = function() {
  var R = this.rgb[0];
  var G = this.rgb[1];
  var B = this.rgb[2];
  this.lightness = Math.round(0.2126*R + 0.7152*G + 0.0722*B);
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
