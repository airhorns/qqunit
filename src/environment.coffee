{jsdom} = require 'jsdom'

window = jsdom("<html><head><script></script></head><body><div id='qunit-fixture'></div></body></html>").createWindow()
global.window = window
global.document = window.document
window.setTimeout = global.setTimeout
window.clearTimeout = global.clearTimeout

QUnit = require '../qunit/qunit/qunit'
QUnit.config.autostart = false
QUnit.stop()

global.QUnit = QUnit

for k, v of QUnit
  global[k] = v

exports.jsdom = jsdom
