# node-letterboxd

node package to consume latest public diary for a user

currently only consumes the RSS feeds from letterboxd, when API is released this will be used

_TODO: add tests_
_TODO: support lists_

## installation

```bash
npm install letterboxd --save
```

## usage

```javascript
var letterboxd = require('./letterboxd');

letterboxd('zaccolley', function(error, items){
  if (error) {
    return console.log(error);
  }

  console.log(items);
});
```
