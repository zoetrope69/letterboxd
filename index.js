'use strict';

var request = require('request');
var cheerio = require('cheerio');

function isListItem(element) {
  if (getUri(element).indexOf('/list/') !== -1) {
    return false;
  }
}

function getDate(element) {
  return {
    watched: +new Date(element.find('letterboxd\\:watchedDate').text()),
    published: +new Date(element.find('pubDate').text())
  };
}

function getUri(element) {
  return element.find('link').html();
}

function getTitleData(element) {
  return element.find('title').text();
}

function getSpoilers(element) {
  var titleData = getTitleData(element);

  var containsSpoilersString = '(contains spoilers)';
  return (titleData.indexOf(containsSpoilersString) !== -1);
}

function getRating(element) {
  var titleData = getTitleData(element);
  var spoilers = getSpoilers(element);

  var rating = {
    text: 'None'
  };

  var ratingStringPosition = titleData.lastIndexOf('-');

  // if there is no '-' character there is no rating
  if (ratingStringPosition !== -1) {
    var endPosition = titleData.length;
    if (spoilers) {
      var containsSpoilersString = '(contains spoilers)';
      endPosition = endPosition - containsSpoilersString.length - 1;
    }
    rating.text = titleData.substring(ratingStringPosition + 2, endPosition);
  }

  // give a number score for the text that matches
  var score2Text = {
    'None': -1.0, '½': 0.5, '★': 1.0, '★½': 1.5, '★★': 2.0, '★★½': 2.5,
    '★★★': 3.0, '★★★½': 3.5, '★★★★': 4.0, '★★★★½': 4.5, '★★★★★': 5.0,
  };
  rating.score = score2Text[rating.text];

  return rating;
}

function getTitleYearData(element) {
  var titleData = getTitleData(element);
  var rating = getRating(element);
  var ratingStringPosition = titleData.lastIndexOf('-');

  // if there is no rating titleAndYear is the whole string
  if (typeof rating.score === 'undefined' || rating.score === -1) {
    return titleData;
  } else {
    return titleData.substring(0, ratingStringPosition - 1);
  }
}

function getTitle(element) {
  var titleData = getTitleData(element);
  var titleAndYear = getTitleYearData(element);
  var lastComma = titleAndYear.lastIndexOf(',');
  return titleData.substring(0, lastComma);
}

function getYear(element) {
  var titleData = getTitleData(element);
  var titleAndYear = getTitleYearData(element);
  var lastComma = titleAndYear.lastIndexOf(',');
  return titleData.substring(lastComma + 2, titleAndYear.length);
}

function getImage(element) {
  var description = element.find('description').text();
  var $ = cheerio.load(description);

  // find the film poster and grab it's src
  var image = $('p img').attr('src');
  return {
    tiny: image.replace('-0-150-0-225-crop', '-0-35-0-50-crop'),
    small: image.replace('-0-150-0-225-crop', '-0-70-0-105-crop'),
    medium: image,
    large: image.replace('-0-150-0-225-crop', '-0-230-0-345-crop')
  };
}

function getReview(element) {
  var description = element.find('description').text();
  var $ = cheerio.load(description);

  var reviewParagraphs = $('p');

  // if there is no review return the item
  if (reviewParagraphs.length <= 0) {
    return false;
  }

  // the rest of description is a review, if there is no review the string 'Watched on ' will appear
  // this assumes you didn't write the 'Watched on ' string in your review... weak
  if (reviewParagraphs.last().text().indexOf('Watched on ') !== -1) {
    return false;
  }

  var review = '';

  // loop through paragraphs
  reviewParagraphs.each(function(){
    var reviewParagraph = $(this).text();

    // only add paragaphs that are the review
    if (reviewParagraph !== 'This review may contain spoilers.') {
      review += reviewParagraph + '\n';
    }
  });

  // tidy up and add review to the item
  review = review.trim();

  return review;
}

function processItem(element) {
  // no support for lists for now
  if (isListItem(element)) {
    return false;
  }

  var item = {
    film: {
      title: getTitle(element),
      year: getYear(element),
      image: getImage(element)
    },
    rating: getRating(element),
    review: getReview(element),
    spoilers: getSpoilers(element),
    date: getDate(element),
    uri: getUri(element)
  };

  return item;
}

function invalidUsername(username) {
  return !username || username.trim().length <= 0;
}

function main(username, callback) {
  // check if a valid username has been passed in
  if (invalidUsername(username)) {
    return callback('No username sent as a parameter');
  }

  var uri = 'https://letterboxd.com/' + username + '/rss/';

  request(uri, function (error, response, body) {
    if (error) {
      return callback('Error:', error);
    }

    // if 404 we're assuming that the username does not exist or have a public RSS feed
    if (response.statusCode === 404) {
      return callback('No RSS feed found for username by "'+ username +'" at Letterboxd');
    } else if (response.statusCode !== 200) {
      return callback('Something went wrong');
    }

    var $ = cheerio.load(body, { xmlMode: true });

    var items = [];

    $('item').each(function(i, element) {
      var item = processItem($(element));

      if (item) {
        items[i] = item;
      }
    });

    return callback(null, items);
  });
};

module.exports = main;
