spiderman = {
    pageCount: 0,
    options: {}, 

    punch: (page) ->
        # spiderman._.extend(this.options, opts);
        console.log('begin');
        spiderman.spider(page);
        return    

    showErrors: (error) ->
        console.log(error);
        error 

    spider: (page) ->
        console.log('spider called');
        cheerio = require('cheerio')
        request = require('request')
        zombie = require('zombie')
        _ = require('lodash')

        console.log(page);

        request({uri: page}, (err, response, body) ->
            console.log('ok');
            if(typeof response != "undefined")
                if(err && response.statusCode != 200) then spiderman.showErrors('Request error with' + page);
                
                $ = cheerio.load(body)
                $body = $('body')
                links = $('a')

                if(links.length <= 0) then spiderman.showErrors("No links found, perhaps it is a flash page?");

                _.each(links, (link) -> 
                    console.log(link);
                    return
                )

                return
        )

        return

}

module.exports = spiderman