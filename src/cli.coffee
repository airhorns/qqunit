Runner = require './runner'
path = require 'path'

files = (process.ARGV || process.argv).slice(2)
files = (path.resolve file for file in files)

Runner.run files, (stats) ->
  process.exit stats.failed
