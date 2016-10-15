# letterboxd
[![Build Status](https://travis-ci.org/zaccolley/letterboxd.svg?branch=master)](https://travis-ci.org/zaccolley/letterboxd)

get public diary data for letterboxd users

_currently only consumes the RSS feeds from letterboxd, when API is released this will be used_

## installation

```bash
npm install letterboxd --save
```

## usage

### function(username, [callback])

Returns a promise if no callback is provided.

```javascript
var letterboxd = require('letterboxd');

letterboxd('zaccolley')
  .then(function(items) {
    console.log(items);
  })
  .catch(function(error) {
    console.log(error);
  });
```

or

```javascript
var letterboxd = require('letterboxd');

letterboxd('zaccolley', function(error, items){
  if (error) {
    return console.log(error);
  }

  console.log(items);
});
```

#### output

```javascript
[
  {
    film: {
      title: 'Zootopia',
      year: '2016',
      image: { tiny: '...', small: '...', medium: '...', large: '...' }
    },
    rating: { text: '★★★★', score: 4 },
    review: 'proper cute, funny and interesting through out. ...',
    spoilers: false,
    date: { watched: 1463702400000, published: 1463784779000 },
    uri: 'https://letterboxd.com/zaccolley/film/zootopia/'
  },
  //...
]
```
