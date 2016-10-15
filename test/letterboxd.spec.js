'use strict';

var expect = require('chai').expect;
var nock = require('nock');

var letterboxd = require('../index.js');

var baseUrl = 'https://letterboxd.com';

describe('letterboxd', function () {
  it('should return an error if the username is null', function (done) {
    var username = null;

    letterboxd(username, function (error, items) {
      expect(error).to.exist;
      expect(items).to.not.exist;

      expect(error).to.eql('No username sent as a parameter');

      done();
    });
  });

  it('should return an error if the username is blank', function (done) {
    var username = '   ';

    letterboxd(username, function (error, items) {
      expect(error).to.exist;
      expect(items).to.not.exist;

      expect(error).to.eql('No username sent as a parameter');

      done();
    });
  });

  it('should return an error for a non-existing username', function (done) {
    var username = 'unknown-user';

    nock(baseUrl)
      .get('/' + username + '/rss/')
      .reply(404);

    letterboxd(username, function (error, items) {
      expect(error).to.exist;
      expect(items).to.not.exist;

      expect(error).to.eql('No RSS feed found for username by "' + username + '" at Letterboxd');

      done();
    });
  });

  it('should return an array of items for a valid username', function (done) {
    var username = 'zaccolley';
    var expectedItems = [
      {
        film: {
          title: 'Steve Jobs',
          year: '2015',
          image: {
            large: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-230-0-345-crop.jpg?k=ab7aba0910',
            medium: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-150-0-225-crop.jpg?k=ab7aba0910',
            small: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-70-0-105-crop.jpg?k=ab7aba0910',
            tiny: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-35-0-50-crop.jpg?k=ab7aba0910'
          }
        },
        rating: { text: 'None', score: -1 },
        review: false,
        spoilers: false,
        date: { watched: 1475971200000, published: 1476047737000 },
        uri: 'https://letterboxd.com/zaccolley/film/steve-jobs/'
      },
      {
        film: {
            title: 'Sausage Party',
          year: '2016',
          image: {
            large: 'https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-230-0-345-crop.jpg?k=6dff82ac2b',
            medium: 'https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-150-0-225-crop.jpg?k=6dff82ac2b',
            small: 'https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-70-0-105-crop.jpg?k=6dff82ac2b',
            tiny: 'https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-35-0-50-crop.jpg?k=6dff82ac2b'
          }
        },
        rating: { text: '★', score: 1 },
        review: 'piece of shit',
        spoilers: true,
        date: { watched: 1472860800000, published: 1472923610000 },
        uri: 'https://letterboxd.com/zaccolley/film/sausage-party/'
      },
      {
        date: {
          published: 1474076102000,
          watched: 1473984000000,
        },
        film: {
          image: false,
          title: "LBJ",
          year: "2016",
        },
        rating: {
          score: 2.5,
          text: "★★½",
        },
        review: "There are several reasons why Rob Reiner might not seem like the right guy to direct a movie about LBJ. For one thing, the filmmaker has always been an outspoken liberal. For another, it’s hard to imagine that a man whose recent output includes “Flipped” and “The Bucket List” has any interest in making a movie about real people, let alone someone so famous. (We’ll grant him “Being Charlie,” the intensely personal drama he made about his son earlier this year.)\nBut the most pressing reason why Reiner doesn’t seem like a natural fit for the subject is that we live in a world where actual politics are starting to feel more like the movies with every passing day, and this may not the best time for someone with such cartoonish sensibilities to revisit the beltway. After all, the climactic speech that Michael Douglas delivered at the end of Reiner’s “The American President” is more urgent now than ever — once upon a time, “We have serious problems to solve and we need serious people to solve them” was the rousing stuff of a sweet romantic comedy, and not something that we desperately need to remind 50% of the people in this country.\nREAD THE FULL REVIEW ON INDIEWIRE",
        spoilers: false,
        uri: "https://letterboxd.com/zaccolley/film/lbj-2016/"
      }
    ];

    nock(baseUrl)
      .get('/' + username + '/rss/')
      .replyWithFile(200, __dirname + '/fixtures/diary-sample.xml', {
        'Content-Type': 'application/xml'
      });

    letterboxd(username, function (error, items) {
      expect(error).to.not.exist;
      expect(items).to.exist;

      expect(items).to.be.an('array');
      expect(items).to.eql(expectedItems);

      done();
    });
  });
});
