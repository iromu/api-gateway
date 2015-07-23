# rest api gateway

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![Dev Dependency Status][dev-dep-image]][dev-dep-url]

[travis-image]: https://travis-ci.org/iromu/api-gateway.svg?branch=develop
[travis-url]: https://travis-ci.org/iromu/api-gateway

[coveralls-image]: https://coveralls.io/repos/iromu/api-gateway/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/iromu/api-gateway?branch=master

[dep-image]: https://david-dm.org/iromu/api-gateway.svg
[dep-url]: https://david-dm.org/iromu/api-gateway#info=dependencies&view=table

[dev-dep-image]: https://david-dm.org/iromu/api-gateway/dev-status.svg
[dev-dep-url]: https://david-dm.org/iromu/api-gateway#info=devDependencies&view=table


### Install
  
      $ npm install -g bower grunt-cli
    
      $ npm install
    
      $ bower install
   
### Test

Run karma and mocha

    $ grunt test 
         
### Coverage

Run istanbul (install with `npm install -g istanbul`)

    $ istanbul cover -- grunt test         
      
### Run embedded server

You need a running local mongodb instance. (For OSX, 'brew install mongodb')

    $ grunt serve
  
### Open location in browser

    http://localhost:9000
      
### Settings

`X-Api-Version` parameter from header or querystring


###### Test links

Call http://localhost:9000/api/samples/v1/hello rest resource
 
    GET http://localhost:9000/sampleservice/hello?X-Api-Version=1.0.1

Response

```json
{
  "message": "Hello world",
  "version": "1.0.1"
}
```

Call http://localhost:9000/api/samples/v2/hello rest resource
 
    GET http://localhost:9000/sampleservice/hello?X-Api-Version=2.0.0

Response

```json
{
  "message": "Hello world",
  "version": "2.0.0"
}
```
