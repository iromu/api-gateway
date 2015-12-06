# rest api gateway

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![Dev Dependency Status][dev-dep-image]][dev-dep-url]

[travis-image]: https://travis-ci.org/iromu/api-gateway.svg?branch=master
[travis-url]: https://travis-ci.org/iromu/api-gateway

[dep-image]: https://david-dm.org/iromu/api-gateway.svg
[dep-url]: https://david-dm.org/iromu/api-gateway#info=dependencies&view=table

[dev-dep-image]: https://david-dm.org/iromu/api-gateway/dev-status.svg
[dev-dep-url]: https://david-dm.org/iromu/api-gateway#info=devDependencies&view=table

[coveralls-image]: https://coveralls.io/repos/iromu/api-gateway/badge.svg?branch=develop&service=github
[coveralls-url]: https://coveralls.io/github/iromu/api-gateway?branch=develop

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Use](#use)
- [Development](#development)
  - [Run embedded server](#run-embedded-server)
  - [Open location in browser](#open-location-in-browser)
  - [Test](#test)
  - [Coverage](#coverage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Install
  
      $ npm install -g bower grunt-cli
    
      $ npm install
    
      $ bower install
      

## Use

Set `X-Api-Version` parameter from header or querystring to route the call to the correct version api from upstream.    
      
## Development
            
      
### Run embedded server

You need a running local mongodb instance. (For OSX, 'brew install mongodb')

    $ grunt serve
  
### Open location in browser

    http://localhost:9000
      

### Test

##### Run karma and mocha

    $ grunt test
    
##### Test only rest api with mocha

    $ grunt test:server
    
##### Test only frontend with karma

    $ grunt test:client
    
##### Run e2e with protractor

To setup protractor e2e tests, you must first run

    $ npm run update-webdriver
    
Run    

    $ grunt test:e2e
         

### Coverage

Run istanbul (install with `npm install -g istanbul`)

    $ istanbul cover -- grunt test   


Open HTML reports:

    open coverage/lcov-report/index.html
    open coverage/client-report/index.html



##### Test links



###### Sample service model seed data

```json
{
    "name": "Sample Service",
    "code": "sampleservice",
    "public": true,
    "latestVersion": "0.0.1",
    "hits": 10,
    "endpoints": [{
        "uri": "http://localhost:9000/api/samples/v1",
        "apiVersion": "1.0.1"
    }, {
        "uri": "http://localhost:9000/api/samples/v2",
        "apiVersion": "2.0.0"
    }, {
        "uri": "http://localhost:9000/api/samples/v2",
        "apiVersion": "2.0.3"
    }, {
        "uri": "http://localhost:9000/api/samples/v2",
        "apiVersion": "2.1.0"
    }]
}
```

###### Call http://localhost:9000/api/samples/v1/hello
 
    GET http://localhost:9000/sampleservice/hello?X-Api-Version=1.0.1

Response

```json
{
  "message": "Hello world",
  "version": "1.0.1"
}
```

###### Call http://localhost:9000/api/samples/v2/hello
 
    GET http://localhost:9000/sampleservice/hello?X-Api-Version=2.0.0

Response

```json
{
  "message": "Hello world",
  "version": "2.0.0"
}
```
