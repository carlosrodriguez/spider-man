var spiderman;

spiderman = {
  zombie: require('zombie'),
  _: require('lodash'),
  options: {},
  punch: function(opts) {
    spiderman._.extend(this.options, opts);
  }
};

module.exports = spiderman;
