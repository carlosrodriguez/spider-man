var spiderman = require('../lib/spider-man.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['spiderman'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'Sanity Check': function(test) {
    test.expect(3);
    // tests here
    test.equal(typeof(spiderman.web), 'function', 'spiderman.punch is a function');
    test.equal(typeof(spiderman.spider), 'function', 'spiderman.spider is a function');
    test.equal(typeof(spiderman.checkInternal), 'function', 'spiderman.checkInternal is a function');
    test.done();
  },
  'Check internal links': function(test) {
    //test.expect(3);
    // tests here
    spiderman.location = "http://www.test.com";
    test.ok(spiderman.checkInternal("test.html"), 'Got internal link');
    test.ok(!spiderman.checkInternal("http://www.test2.com/test.html"), 'Got external link');
    test.ok(!spiderman.checkInternal("test.jpg"), 'Got external link for a media file');

    test.done();
  }
};
