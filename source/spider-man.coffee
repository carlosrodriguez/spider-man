spiderman = {
    zombie: require('zombie'),
    _: require('lodash'),
    options: {}, 

    punch: (opts) ->
        spiderman._.extend(this.options, opts);
        return     
}

module.exports = spiderman