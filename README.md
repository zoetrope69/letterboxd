# letterboxd

get public diary data for letterboxd users

_currently only consumes the RSS feeds from letterboxd, when API is released this will be used_

## installation

```bash
npm install letterboxd --save
```

## usage

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
    date: { watched: 1463702400000, published: 1463784779000 },
    uri: 'https://letterboxd.com/zaccolley/film/zootopia/',
    rating: { text: '★★★★', score: 4 },
    film: {
      title: 'Zootopia',
      year: '2016',
      image: { tiny: '...', small: '...', medium: '...', large: '...' } 
    },
    review: 'proper cute, funny and interesting through out. ...'
  },
  //...
]
```

## todo

1. add tests
2. add support for consuming lists
