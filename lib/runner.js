(function() {
  var Environment, Runner;

  Environment = require('./environment');

  try {
    require('coffee-script');
  } catch (e) {

  }

  module.exports = Runner = {
    run: function(files, callback) {
      var currentFailureQueue, failures, file, ongoingTest, startTime, _i, _len;
      QUnit.config.autorun = false;
      try {
        startTime = (new Date).getTime();
        if (process.env['FILTER']) {
          console.warn("Filter: " + process.env['FILTER']);
          QUnit.config.filter = process.env['FILTER'];
        }
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          require(file);
        }
        failures = {};
        currentFailureQueue = false;
        ongoingTest = false;
        process.on('exit', function() {
          if (ongoingTest) {
            console.warn(" - Failure in " + QUnit.config.current.testName + ": Never finished!");
            return process.exit(1);
          }
        });
        QUnit.testStart(function(_arg) {
          var name;
          name = _arg.name;
          ongoingTest = true;
          return currentFailureQueue = failures[name] = [];
        });
        QUnit.log(function(details) {
          var output;
          if (!details.result) {
            output = details.message ? details.message + ", " : "";
            if (details.actual) {
              output += "expected: " + details.expected + ", actual: " + details.actual;
            }
            if (details.source) {
              output += "\n " + details.source;
            }
            details.message = output;
            return currentFailureQueue.push(details);
          }
        });
        QUnit.testDone(function(_arg) {
          var failed, name, passed, total;
          name = _arg.name, failed = _arg.failed, passed = _arg.passed, total = _arg.total;
          process.stdout.write(failed > 0 ? "F" : ".");
          return ongoingTest = false;
        });
        QUnit.done(function(stats) {
          var duration, endTime, fail, fails, name, _j, _len1;
          endTime = (new Date).getTime();
          duration = Math.round((endTime - startTime) / 1000);
          console.log("\n");
          for (name in failures) {
            fails = failures[name];
            if (!(fails.length > 0)) {
              continue;
            }
            console.warn(" - Failure in '" + name + "'");
            for (_j = 0, _len1 = fails.length; _j < _len1; _j++) {
              fail = fails[_j];
              console.warn("     " + fail.message);
            }
          }
          console.log("Finished. " + stats.passed + " of " + stats.total + " assertions passed (" + stats.failed + " failures). " + duration + " seconds elapsed.");
          return typeof callback === "function" ? callback(stats) : void 0;
        });
        return QUnit.start();
      } catch (e) {
        console.warn(e.stack);
        return process.exit(1);
      }
    }
  };

}).call(this);
