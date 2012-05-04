var spiderman;

spiderman = {
  extensions: /^.*\.(jpg|jpeg|png|gif|flv|mov|mp3|mp4|txt|pdf)$/i,
  location: '',
  pages: [],
  pageCount: 0,
  options: {},
  punch: function(page) {
    console.log('Begin');
    spiderman.location = page;
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
    console.log("Check " + page);
    request({
      uri: page
    }, function(err, response, body) {
      var $, $body, links;
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
          var upcoming, _ref;
          page = $(link).attr('href');
          if ($.inArray(page, spiderman.pages) === -1) {
            if (spiderman.checkInternal(page)) {
              if (page.indexOf("http:") === -1) {
                upcoming = (_ref = page.indexOf("/") === 0) != null ? _ref : "http://" + location + {
                  page: "http://" + location + "/" + page
                };
              } else {
                upcoming = page;
              }
            }
            spiderman.spider(upcoming);
            spiderman.pages.push(page);
          }
        });
      }
    });
  },
  checkInternal: function(page) {
    var comp;
    comp = new RegExp(spiderman.location);
    if (typeof page !== "undefined") {
      if ((comp.test(page)) || (page.indexOf("http:") === -1) && (page.indexOf("javascript:") === -1) && (!page.match(spiderman.extensions))) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};

module.exports = spiderman;
