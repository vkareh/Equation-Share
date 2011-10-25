
/**
 * Generate 5-character hash for the URL.
 */
exports.random = function(length) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var string = '';
  for (var i = 0; i < length; i++) {
    var rand = Math.floor(Math.random() * chars.length);
    string += chars.substring(rand,rand + 1);
  }
  return string;
};

/**
 * Trim empty characters from string.
 */
exports.trim = function(string) {
  return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

/**
 * Converts a LaTeX string to PNG.
 */
exports.tex2png = function(tex) {
  var util = require('util');
  var exec = require('child_process').exec;
  var child;

  child = exec('dvi2png ' + tex, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}
