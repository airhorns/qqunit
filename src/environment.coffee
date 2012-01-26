{jsdom} = require 'jsdom'

window = jsdom("<html><head><script></script></head><body></body></html>").createWindow()
global.window = window
global.document = window.document
window.setTimeout = global.setTimeout
window.clearTimeout = global.clearTimeout

{QUnit} = require '../qunit/qunit/qunit'
QUnit.config.autostart = false
QUnit.stop()

global.QUnit = QUnit

for k, v of QUnit
  global[k] = v

process.on 'SIGINT', ->
  if QUnit.config.current?
    console.warn "Quitting..."
    console.warn "Current test was #{QUnit.config.current.module}: #{QUnit.config.current.testName}"
  process.exit 1

exports.jsdom = jsdom
