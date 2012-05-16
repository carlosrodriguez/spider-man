var spiderman;

spiderman = {
  extensions: /^.*\.(jpg|jpeg|png|gif|flv|mov|mp3|mp4|txt|pdf)$/i,
  location: '',
  pages: [],
  pageCount: 0,
  totalPages: 0,
  options: {},
  web: function(page, callback) {
    console.log('Begin');
    spiderman.location = page;
    spiderman.spider(page, true);
    process.on('exit', function() {
      return spiderman.showResults(callback);
    });
  },
  showErrors: function(error) {
    console.log(error);
    return error;
  },
  spider: function(page, follow) {
    var cheerio, request, _;
    cheerio = require('cheerio');
    request = require('request');
    _ = require('lodash');
    console.log("Got page: " + page);
    request({
      uri: page
    }, function(err, response, body) {
      var $, $body, links, r;
      if (typeof response !== "undefined") {
        if (err && response.statusCode !== 200) {
          spiderman.pages.push({
            url: page,
            status: response.statusCode
          });
        } else {
          if (typeof follow !== "undefined") {
            $ = cheerio.load(body);
            $body = $('body');
            links = $('a');
            spiderman.totalPages += links.length;
            if (links.length <= 0) {
              spiderman.showErrors("No links found, perhaps it is a flash page?");
            }
            _.each(links, function(link) {
              var r, upcoming;
              page = $(link).attr('href');
              if ($.inArray(page, _.pluck(spiderman.pages, "url")) === -1) {
                if (spiderman.checkInternal(page)) {
                  if (page.indexOf("http:") === -1) {
                    if (page.indexOf("/") === 0) {
                      upcoming = spiderman.location + page;
                    } else {
                      upcoming = spiderman.location + "/" + page;
                    }
                  } else {
                    upcoming = page;
                  }
                  spiderman.spider(upcoming, true);
                  r = response.statusCode;
                  spiderman.pages.push({
                    url: page,
                    status: r
                  });
                } else {
                  console.log("Not checking external page: " + page);
                }
              } else {
                console.log("Not checking already spidered page: " + page);
              }
            });
          } else {
            r = response.statusCode;
            spiderman.pages.push({
              url: page,
              status: r
            });
          }
        }
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
  },
  showResults: function(callback) {
    var sys;
    sys = require('util');
    console.log(sys.inspect(spiderman.pages));
    if (typeof callback === "function") {
      return callback(spiderman.pages);
    } else {
      return spiderman.pages;
    }
  }
};

module.exports = spiderman;
