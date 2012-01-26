Environment = require './environment'
try
  require 'coffee-script'
catch e

module.exports = Runner =
  run: (files, callback) ->
    QUnit.config.autorun = false

    for file in files
      require file

    failures = {}
    currentFailureQueue = false

    if process.env['FILTER']
      QUnit.config.filter = process.env['filter']

    QUnit.testStart ({name}) ->
      currentFailureQueue = failures[name] = []

    QUnit.log ({result, expected, actual, message}) ->
      if !result
        arguments[0].message ||= "Expected #{expected}, got #{actual}"
        currentFailureQueue.push arguments[0]

    QUnit.testDone ({name, failed, passed, total}) ->
      process.stdout.write if failed > 0 then "F" else "."

    QUnit.done (stats) ->
      console.log "\n"
      for name, fails of failures when fails.length > 0
        console.warn " - Failure in '#{name}'"

        for fail in fails
          console.warn "     #{fail.message}"
      console.log "Finished. #{stats.passed} of #{stats.total} assertions passed (#{stats.failed} failures)."
      callback?(stats)

    debugger

    QUnit.start()
