spiderman = {
    extensions: /^.*\.(jpg|jpeg|png|gif|flv|mov|mp3|mp4|txt|pdf)$/i
    location: ''
    pages: []
    pageCount: 0
    totalPages: 0
    options: {} 

    punch: (page, csv) ->
        # spiderman._.extend(this.options, opts);
        console.log('Begin')

        if(typeof(csv) == "undefined")
            spiderman.location = page
            spiderman.spider(page, true)
        else
            spiderman.parseCsv(page)

        process.on('exit', () ->
            spiderman.showResults()
        )

        return    

    showErrors: (error) ->
        console.log(error);
        error 

    spider: (page, follow) ->
        cheerio = require('cheerio')
        request = require('request')
        zombie = require('zombie')
        _ = require('lodash')

        console.log("Checking: "+page);

        request({uri: page}, (err, response, body) ->
            if(typeof response != "undefined")

                if(err && response.statusCode != 200) then spiderman.showErrors('Request error with' + page)
                
                if(typeof(follow) != "undefined")
                    $ = cheerio.load(body)
                    $body = $('body')
                    links = $('a')

                    spiderman.totalPages += links.length

                    if(links.length <= 0) then spiderman.showErrors("No links found, perhaps it is a flash page?")

                    _.each(links, (link) -> 
                        page = $(link).attr('href')
                        if($.inArray(page, _.pluck(spiderman.pages, "url")) == -1)
                            if(spiderman.checkInternal(page))
                                if(page.indexOf("http:") == -1)
                                    if(page.indexOf("/") == 0)
                                        upcoming = spiderman.location+page
                                    else
                                        upcoming = spiderman.location+"/"+page
                                else
                                    upcoming = page;

                                spiderman.spider(upcoming, true)
                                r = response.statusCode
                                spiderman.pages.push({url: page, status: r}) 
     
                        return
                    )
                else
                    r = response.statusCode
                    spiderman.pages.push({url: page, status: r}) 
                return
        )

        return

    parseCsv: (file) ->
        csv = require('ya-csv')
        reader = csv.createCsvFileReader(file, { columnsFromHeader: true });

        reader.addListener('data', (page) ->
            spiderman.spider(page.URL)
        )

        reader.addListener('end', () ->
            console.log('End CSV parser. Waiting for results')
        );

        return reader;

    checkInternal: (page) -> 

        comp = new RegExp(spiderman.location);

        if(typeof page != "undefined")
            if ((comp.test(page)) || (page.indexOf("http:") == -1) && (page.indexOf("javascript:") == -1) && (!page.match(spiderman.extensions))) 
                true
            else 
                false 
        else
            false

    showResults: () ->
        sys = require('util')
        console.log(sys.inspect(spiderman.pages))

        return spiderman.pages
}

module.exports = spiderman