(function() {
  var Runner, file, files, path;

  Runner = require('./runner');

  path = require('path');

  files = (process.ARGV || process.argv).slice(2);

  files = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      _results.push(path.resolve(file));
    }
    return _results;
  })();

  Runner.run(files, function(stats) {
    return process.exit(stats.failed);
  });

}).call(this);
