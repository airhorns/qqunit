(function() {
  var Environment, Runner;

  Environment = require('./environment');

  try {
    require('coffee-script');
  } catch (e) {

  }

  module.exports = Runner = {
    run: function(files, callback) {
      var currentFailureQueue, failures, file, startTime, _i, _len;
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
        QUnit.testStart(function(_arg) {
          var name;
          name = _arg.name;
          return currentFailureQueue = failures[name] = [];
        });
        QUnit.log(function(_arg) {
          var actual, expected, message, result, _base;
          result = _arg.result, expected = _arg.expected, actual = _arg.actual, message = _arg.message;
          if (!result) {
            (_base = arguments[0]).message || (_base.message = "Expected " + expected + ", got " + actual);
            return currentFailureQueue.push(arguments[0]);
          }
        });
        QUnit.testDone(function(_arg) {
          var failed, name, passed, total;
          name = _arg.name, failed = _arg.failed, passed = _arg.passed, total = _arg.total;
          return process.stdout.write(failed > 0 ? "F" : ".");
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
