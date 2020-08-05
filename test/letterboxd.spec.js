"use strict";

var path = require("path");
var expect = require("chai").expect;
var nock = require("nock");

var letterboxd = require("../index.js");

var baseUrl = "https://letterboxd.com";

describe("letterboxd", function () {
  it("should return an error if the username is null", function (done) {
    var username = null;

    letterboxd(username, function (error, items) {
      expect(error).to.exist;
      expect(items).to.not.exist;

      expect(error).to.eql("No username sent as a parameter");

      done();
    });
  });

  it("should return an error if the username is blank", function (done) {
    var username = "   ";

    letterboxd(username, function (error, items) {
      expect(error).to.exist;
      expect(items).to.not.exist;

      expect(error).to.eql("No username sent as a parameter");

      done();
    });
  });

  it("should return an error for a non-existing username", function (done) {
    var username = "unknown-user";

    nock(baseUrl)
      .get("/" + username + "/rss/")
      .reply(404);

    letterboxd(username, function (error, items) {
      expect(error).to.exist;
      expect(items).to.not.exist;

      expect(error).to.eql(
        'No RSS feed found for username by "' + username + '" at Letterboxd'
      );

      done();
    });
  });

  it("should return an array of items for a valid username", function (done) {
    var username = "zaccolley";
    var expectedItems = [
      {
        type: "diary",
        film: {
          title: "Steve Jobs",
          year: "2015",
          image: {
            large:
              "https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-230-0-345-crop.jpg?k=ab7aba0910",
            medium:
              "https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-150-0-225-crop.jpg?k=ab7aba0910",
            small:
              "https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-70-0-105-crop.jpg?k=ab7aba0910",
            tiny:
              "https://a.ltrbxd.com/resized/sm/upload/ql/1g/sz/63/7SUaf2UgoY0ZRGbQtRlfDkLDBCb-0-35-0-50-crop.jpg?k=ab7aba0910",
          },
        },
        rating: { text: "None", score: -1 },
        review: false,
        spoilers: false,
        date: { watched: 1475971200000, published: 1476047737000 },
        uri: "https://letterboxd.com/zaccolley/film/steve-jobs/",
      },
      {
        type: "diary",
        film: {
          title: "Sausage Party",
          year: "2016",
          image: {
            large:
              "https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-230-0-345-crop.jpg?k=6dff82ac2b",
            medium:
              "https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-150-0-225-crop.jpg?k=6dff82ac2b",
            small:
              "https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-70-0-105-crop.jpg?k=6dff82ac2b",
            tiny:
              "https://a.ltrbxd.com/resized/sm/upload/h4/fy/g1/ks/jDeDRLEa8JqB3xmKVy6q3bkmDt6-0-35-0-50-crop.jpg?k=6dff82ac2b",
          },
        },
        rating: { text: "★", score: 1 },
        review: "piece of shit",
        spoilers: true,
        date: { watched: 1472860800000, published: 1472923610000 },
        uri: "https://letterboxd.com/zaccolley/film/sausage-party/",
      },
      {
        type: "diary",
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
        review:
          "There are several reasons why Rob Reiner might not seem like the right guy to direct a movie about LBJ. For one thing, the filmmaker has always been an outspoken liberal. For another, it’s hard to imagine that a man whose recent output includes “Flipped” and “The Bucket List” has any interest in making a movie about real people, let alone someone so famous. (We’ll grant him “Being Charlie,” the intensely personal drama he made about his son earlier this year.)\nBut the most pressing reason why Reiner doesn’t seem like a natural fit for the subject is that we live in a world where actual politics are starting to feel more like the movies with every passing day, and this may not the best time for someone with such cartoonish sensibilities to revisit the beltway. After all, the climactic speech that Michael Douglas delivered at the end of Reiner’s “The American President” is more urgent now than ever — once upon a time, “We have serious problems to solve and we need serious people to solve them” was the rousing stuff of a sweet romantic comedy, and not something that we desperately need to remind 50% of the people in this country.\nREAD THE FULL REVIEW ON INDIEWIRE",
        spoilers: false,
        uri: "https://letterboxd.com/zaccolley/film/lbj-2016/",
      },
      {
        type: "list",
        date: {
          published: 1473470608000,
        },
        title: "TIFF 2016",
        description: "TIFF is very nice",
        ranked: true,
        films: [
          {
            title: "Moonlight",
            uri: "https://letterboxd.com/film/moonlight-2016/",
          },
          { title: "Jackie", uri: "https://letterboxd.com/film/jackie-2016/" },
          {
            title: "Toni Erdmann",
            uri: "https://letterboxd.com/film/toni-erdmann/",
          },
          {
            title: "Personal Shopper",
            uri: "https://letterboxd.com/film/personal-shopper/",
          },
          {
            title: "La La Land",
            uri: "https://letterboxd.com/film/la-la-land/",
          },
          {
            title: "The Handmaiden",
            uri: "https://letterboxd.com/film/the-handmaiden/",
          },
          {
            title: "Manchester by the Sea",
            uri: "https://letterboxd.com/film/manchester-by-the-sea/",
          },
          {
            title: "American Honey",
            uri: "https://letterboxd.com/film/american-honey/",
          },
          {
            title: "The Edge of Seventeen",
            uri: "https://letterboxd.com/film/the-edge-of-seventeen/",
          },
          { title: "Una", uri: "https://letterboxd.com/film/una-2016/" },
        ],
        totalFilms: 56,
        uri: "https://letterboxd.com/zaccolley/list/tiff-2016/",
      },
      {
        type: "list",
        date: {
          published: 1474161808000,
        },
        title: "Fake List",
        description: false,
        ranked: false,
        films: [
          { title: "Fake", uri: "https://letterboxd.com/film/fake-2016/" },
          { title: "Fake 2", uri: "https://letterboxd.com/film/fake-2-2016/" },
        ],
        totalFilms: 2,
        uri: "https://letterboxd.com/zaccolley/list/fake-list/",
      },
    ];

    nock(baseUrl)
      .get("/" + username + "/rss/")
      .replyWithFile(200, path.join(__dirname, "/fixtures/rss-sample.xml"), {
        "Content-Type": "application/xml",
      });

    letterboxd(username, function (error, items) {
      expect(error).to.not.exist;
      expect(items).to.exist;

      expect(items).to.be.an("array");
      expect(items).to.eql(expectedItems);

      done();
    });
  });
});
