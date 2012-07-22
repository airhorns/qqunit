Environment = require './environment'

# Require coffee-script so the requiring of the test files below
# will work if they are coffee files.
try
  require 'coffee-script'
catch e


module.exports = Runner =
  run: (files, callback) ->
    QUnit.config.autorun = false

    try
      startTime = (new Date).getTime()

      if process.env['FILTER']
        console.warn "Filter: #{process.env['FILTER']}"
        QUnit.config.filter = process.env['FILTER']

      for file in files
        require file

      failures = {}
      currentFailureQueue = false
      ongoingTest = false

      process.on 'exit', ->
        if ongoingTest
          console.warn " - Failure in #{QUnit.config.current.testName}: Never finished!"
          process.exit 1

      QUnit.testStart ({name}) ->
        ongoingTest = true
        currentFailureQueue = failures[name] = []

      QUnit.log (details) ->
        if !details.result
          output = if details.message then details.message + ", " else ""
          if details.actual
            output += "expected: #{details.expected}, actual: #{details.actual}"

          if details.source
            output += "\n #{details.source}"

          details.message = output
          currentFailureQueue.push details

      QUnit.testDone ({name, failed, passed, total}) ->
        process.stdout.write(if failed > 0 then "F" else ".")
        ongoingTest = false

      QUnit.done (stats) ->
        endTime = (new Date).getTime()
        duration = Math.round((endTime - startTime) / 1000)
        console.log "\n"
        for name, fails of failures when fails.length > 0
          console.warn " - Failure in '#{name}'"

          for fail in fails
            console.warn "     #{fail.message}"

        console.log "Finished. #{stats.passed} of #{stats.total} assertions passed (#{stats.failed} failures). #{duration} seconds elapsed."
        callback?(stats)

      QUnit.start()

    # Catch errors manually here since jsdom's error handling for event dispatch will just suppress it.
    catch e
      console.warn e.stack
      process.exit(1)

