I was once [lost](https://github.com/kof/node-qunit), but now I'm found.

# This is the QUnit test framework for nodejs v0.4 and v0.6.

## Why QUnit and not nodeunit or mocha?

 - QUnit is awesome. Super stable, well maintained, fast, has handy stuff, and widely used already for browser testing.
 - QUnit is simple, yet still extensible. It makes for easier to read, more uniform tests when you have fewer ways of expressing what you are testing.
 - Did you see that? qqunit is meant explicitly for testing something in the browser and in node using the same suite. Mocha supports this as well but I find QUnit to be faster and better written.

## Why not node-qunit?

 - Incompatible APIs between 0.4 and 0.6, but if that doesn't matter:
 - An unnecessary multiprocess model which makes anything other than `console.log` debugging really hard
 - Absurd console output for test runs, without any indication of progress.
 - Inability to test data structures with circular references

## How do I use it?

A simple example:

```coffeescript
qqunit = require 'qqunit'
tests = glob.sync("#{__dirname}/test/**/*_test.coffee")
qqunit.Runner.run tests
```

or

```bash
 you@host $: npm install qqunit
 you@host $: qqunit test_a.coffee test_b.coffee
```

More complex:

```coffeescript
glob = require 'glob'
path = require 'path'
qqunit = require 'qqunit'

# Load jquery into window
jqueryPath = path.join(__dirname, 'lib', 'jquery.js')

qqunit.Environment.jsdom.jQueryify window, jQueryPath, (window, jQuery) ->
  global.jQuery = jQuery

  # Load test helper
  Helper = require './batman/test_helper'
  global[k] = v for own k,v of Helper

  global.MyCoolCode = require '../src/my_cool_code'

  tests = glob.sync("#{__dirname}/**/*_test.coffee")

  console.log "Running test suite. #{tests.length} files required."
  qqunit.Runner.run tests, (stats) ->
    process.exit stats.failed
```

Horray!

## Background

qqunit came from me being really, really sad. node-qunit put me in a dark place, but out I have come with less than 100 lines of CoffeeScript which accomplish the same thing. qqunit is stupid simple: run QUnit inside jsdom and add some log statements to show you how it goes in the console.

# License

qqunit is copyright 2012 by Shopify, released under the MIT License (see LICENSE for details).
