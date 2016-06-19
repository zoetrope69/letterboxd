# node-letterboxd

node package to consume latest public diary for a user

_currently only consumes the RSS feeds from letterboxd, when API is released this will be used_

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

### output

```javascript
[
  {
    date: { watched: 1463702400000, published: 1463784779000 },
    uri: 'https://letterboxd.com/zaccolley/film/zootopia/',
    rating: { text: '★★★★', score: 4 },
    film: { title: 'Zootopia', year: '2016' },
    image: 'https://a.ltrbxd.com/resized/sm/upload/wc/zb/eh/qp/bHXf0mrnnRthdWI9MuAMlPftnZK-0-150-0-225-crop.jpg?k=caad643ac9',
    review: 'proper cute, funny and interesting through out. squeed multiple times\nwould be 4 is there wasn\'t so much product placement ahhh'
  },
  //...
]
```

## todo

1. add tests
2. add support for consuming lists
