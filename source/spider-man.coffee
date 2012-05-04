spiderman = {
    extensions: /^.*\.(jpg|jpeg|png|gif|flv|mov|mp3|mp4|txt|pdf)$/i
    location: ''
    pages: []
    pageCount: 0
    options: {} 

    punch: (page) ->
        # spiderman._.extend(this.options, opts);
        console.log('Begin')
        spiderman.location = page
        spiderman.spider(page)
        return    

    showErrors: (error) ->
        console.log(error);
        error 

    spider: (page) ->
        cheerio = require('cheerio')
        request = require('request')
        zombie = require('zombie')
        _ = require('lodash')

        console.log("Check "+page);

        request({uri: page}, (err, response, body) ->
            if(typeof response != "undefined")
                if(err && response.statusCode != 200) then spiderman.showErrors('Request error with' + page)
                
                $ = cheerio.load(body)
                $body = $('body')
                links = $('a')

                if(links.length <= 0) then spiderman.showErrors("No links found, perhaps it is a flash page?")

                _.each(links, (link) -> 
                    page = $(link).attr('href')
                    if($.inArray(page, _.pluck(spiderman.pages, "url")) == -1)
                        if(spiderman.checkInternal(page))
                            if(page.indexOf("http:") == -1)
                                if(page.indexOf("/") == 0)
                                    upcoming = "http://"+spiderman.location+page
                                else
                                    upcoming ="http://"+spiderman.location+"/"+page
                            else
                                upcoming = page;

                            spiderman.spider(upcoming)
                            r = response.statusCode
                            spiderman.pages.push({url: page, status: r})
 
                    return
                )

                return
        )

        return

    checkInternal: (page) -> 

        comp = new RegExp(spiderman.location);

        if(typeof page != "undefined")
            if ((comp.test(page)) || (page.indexOf("http:") == -1) && (page.indexOf("javascript:") == -1) && (!page.match(spiderman.extensions))) 
                true
            else 
                false
            
        else
            false

}

module.exports = spiderman