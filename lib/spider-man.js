var spiderman;

spiderman = {
  pageCount: 0,
  options: {},
  punch: function(page) {
    console.log('begin');
    spiderman.spider(page);
  },
  showErrors: function(error) {
    console.log(error);
    return error;
  },
  spider: function(page) {
    var cheerio, request, zombie, _;
    console.log('spider called');
    cheerio = require('cheerio');
    request = require('request');
    zombie = require('zombie');
    _ = require('lodash');
    console.log(page);
    request({
      uri: page
    }, function(err, response, body) {
      var $, $body, links;
      console.log('ok');
      if (typeof response !== "undefined") {
        if (err && response.statusCode !== 200) {
          spiderman.showErrors('Request error with' + page);
        }
        $ = cheerio.load(body);
        $body = $('body');
        links = $('a');
        if (links.length <= 0) {
          spiderman.showErrors("No links found, perhaps it is a flash page?");
        }
        _.each(links, function(link) {
          console.log(link);
        });
      }
    });
  }
};

module.exports = spiderman;
