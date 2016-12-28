# letterboxd
[![npm](https://img.shields.io/npm/v/letterboxd.svg)](https://www.npmjs.com/package/letterboxd)
[![Build Status](https://travis-ci.org/zaccolley/letterboxd.svg?branch=master)](https://travis-ci.org/zaccolley/letterboxd)
[![Dependancies](https://david-dm.org/zaccolley/letterboxd/status.svg)](https://david-dm.org/zaccolley/letterboxd)
[![Dev dependancies](https://david-dm.org/zaccolley/letterboxd/dev-status.svg)](https://david-dm.org/zaccolley/letterboxd?type=dev)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)
[![Known Vulnerabilities](https://snyk.io/test/github/zaccolley/letterboxd/badge.svg)](https://snyk.io/test/github/zaccolley/letterboxd)

get public data for letterboxd users

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

letterboxd('rubencordeiro')
  .then(function (items) {
    console.log(items);
  })
  .catch(function (error) {
    console.log(error);
  });
```

or

```javascript
var letterboxd = require('letterboxd');

letterboxd('zaccolley', function (error, items){
  if (error) {
    return console.log(error);
  }

  console.log(items);
});
```

#### output

output is an array of items.

there are two types of items: diary entries and lists.

**due to the limitation of the data source (scraping a RSS feed), only the 20 most recent diary entries are returned**

items of note for the list type:

+ `ranked`: shows if it was set to ranked (1, 2, 3, 4).
+ `films`: films in the list, capped at 10
+ `totalFilms`: the total amount of films in the list, only 10 films are given here.

```javascript
[
  {
    type: 'diary',
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
  {
    type: 'list',
    date: {
      published: 1473470608000
    },
    title: 'All The Toy Stories',
    description: 'I fucking love these films lol',
    ranked: false,
    films: [
      { title: 'Toy Story', uri: 'https://letterboxd.com/film/toy-story/' },
      { title: 'Toy Story 2', uri: 'https://letterboxd.com/film/toy-story-2/' },
      { title: 'Toy Story 3', uri: 'https://letterboxd.com/film/toy-story-3/' },
      { title: 'Toy Story That Time Forgot', uri: 'https://letterboxd.com/film/toy-story-that-time-forgot/' },
      { title: 'Toy Story of Terror!', uri: 'https://letterboxd.com/film/toy-story-of-terror/' }
    ],
    totalFilms: 56,
    uri: 'https://letterboxd.com/zaccolley/list/tiff-2016/'
  },
  //...
]
```
