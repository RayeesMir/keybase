# keybase

A version based key-value store. There are different methods of storing and tracking multiple versions of a record based on database you are using and requirement.
I am using mongodb, storing all versions in a same collection with timestamp as version number. 

Keybase Exposes API with following endpoints
 
 1. ```POST /object```  Accepts a key(string) and value(some json blob/string) and stores them in mongodb database.If an existing key is sent,new version of document is created with updated values
 1. ```GET /object/:key``` Accept a key and return the latest value of the key.this enpoint also accepts timestamp as query parameter. GET ```/object/:key?timestamp=``` (unix timestamp in miliseconds) returns the value of the key at that particular time. if timpestamp is before creation of key, API will return 404 not found. 
## Hosted

   http://ec2-13-126-254-11.ap-south-1.compute.amazonaws.com:3000/

## Technology

* Node LTS version(8.11.1)
* Mocha and Chai for Testing
* MongoDB

## Installation & Usage

- clone repoistory.
- cd into the directory.
- run `npm install`
- run `npm start` or `node src/index.js`

## Tests

-  `npm test`

## Docker 
- `docker-compose up`
if it doesn't work may be u  need to change mongodb service volumes path as it different on Mac

