(function() {
  var Environment, Runner;

  Environment = require('./environment');

  try {
    require('coffee-script');
  } catch (e) {

  }

  module.exports = Runner = {
    run: function(files, callback) {
      var currentFailureQueue, failures, file, _i, _len;
      QUnit.config.autorun = false;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        require(file);
      }
      failures = {};
      currentFailureQueue = false;
      if (process.env['FILTER']) QUnit.config.filter = process.env['filter'];
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
        var fail, fails, name, _j, _len2;
        console.log("\n");
        for (name in failures) {
          fails = failures[name];
          if (!(fails.length > 0)) continue;
          console.warn(" - Failure in '" + name + "'");
          for (_j = 0, _len2 = fails.length; _j < _len2; _j++) {
            fail = fails[_j];
            console.warn("     " + fail.message);
          }
        }
        console.log("Finished. " + stats.passed + " of " + stats.total + " assertions passed (" + stats.failed + " failures).");
        return typeof callback === "function" ? callback(stats) : void 0;
      });
      debugger;
      return QUnit.start();
    }
  };

}).call(this);
