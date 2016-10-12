'use strict';

var expect = require('chai').expect;
var nock = require('nock');

var letterboxd = require('../index.js');

var baseUrl = 'https://letterboxd.com';

describe('letterboxd', function () {
    it('should return an error the username is null', function (done) {
        var username = null;

        letterboxd(username, function (error, items) {
            expect(error).to.exist;
            expect(items).to.not.exist;

            expect(error).to.eql('No username sent as a parameter');

            done();
        });
    });

    it('should return an error the username is blank', function (done) {
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
                date: {watched: 1475971200000, published: 1476047737000},
                uri: 'https://letterboxd.com/zaccolley/film/steve-jobs/',
                rating: {text: 'None', score: -1},
                film: {
                    title: 'Steve Jobs',
                    year: '2015',
                    image: {
                        large: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-230-0-345-crop.jpg?k=ab7aba0910',
                        medium: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-150-0-225-crop.jpg?k=ab7aba0910',
                        small: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-70-0-105-crop.jpg?k=ab7aba0910',
                        tiny: 'https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-35-0-50-crop.jpg?k=ab7aba0910'
                    }
                }
            },
            {
                date: {watched: 1472860800000, published: 1472923610000},
                uri: 'https://letterboxd.com/zaccolley/film/sausage-party/',
                rating: {text: '★', score: 1},
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
                review: 'piece of shit'
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
