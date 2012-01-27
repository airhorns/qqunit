(function() {
  var QUnit, jsdom, k, v, window;

  jsdom = require('jsdom').jsdom;

  window = jsdom("<html><head><script></script></head><body></body></html>").createWindow();

  global.window = window;

  global.document = window.document;

  window.setTimeout = global.setTimeout;

  window.clearTimeout = global.clearTimeout;

  QUnit = require('../qunit/qunit/qunit').QUnit;

  QUnit.config.autostart = false;

  QUnit.stop();

  global.QUnit = QUnit;

  for (k in QUnit) {
    v = QUnit[k];
    global[k] = v;
  }

  exports.jsdom = jsdom;

}).call(this);
