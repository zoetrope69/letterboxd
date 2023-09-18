"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = require("cheerio");
function isListItem(element) {
  // if the list path is in the url
  if (getUri(element).includes("/list/")) {
    return true;
  }
  return false;
}
function getPublishedDate(element) {
  return +new Date(element.find("pubDate").text());
}
function getWatchedDate(element) {
  return +new Date(element.find("letterboxd\\:watchedDate").text());
}
function getUri(element) {
  return element.find("link").html();
}
function getTitleData(element) {
  return element.find("title").text();
}
function getTitle(element) {
  return element.find("letterboxd\\:filmTitle").text();
}
function getYear(element) {
  return element.find("letterboxd\\:filmYear").text();
}
function getMemberRating(element) {
  return element.find("letterboxd\\:memberRating").text();
}
function getSpoilers(element) {
  const titleData = getTitleData(element);
  const containsSpoilersString = "(contains spoilers)";
  return titleData.includes(containsSpoilersString);
}
function getIsRewatch(element) {
  const rewatchData = element.find("letterboxd\\:rewatch").text();
  return rewatchData === "Yes";
}
function getRating(element) {
  const memberRating = getMemberRating(element).toString();
  const rating = {
    text: "",
    score: 0, //initialise with 0
  };
  const scoreToTextMap = {
    "-1.0": "None",
    0.5: "½",
    "1.0": "★",
    1.5: "★½",
    "2.0": "★★",
    2.5: "★★½",
    "3.0": "★★★",
    3.5: "★★★½",
    "4.0": "★★★★",
    4.5: "★★★★½",
    "5.0": "★★★★★",
  };
  rating.text = scoreToTextMap[memberRating];
  rating.score = parseFloat(memberRating);
  return rating;
}
function getImage(element) {
  const description = element.find("description").text();
  const $ = (0, cheerio_1.load)(description);
  // find the film poster and grab it's src
  const image = $("p img").attr("src");
  // if the film has no image return no object
  if (!image) {
    return {};
  }
  const originalImageCropRegex = /-0-.*-crop/;
  return {
    tiny: image.replace(originalImageCropRegex, "-0-35-0-50-crop"),
    small: image.replace(originalImageCropRegex, "-0-70-0-105-crop"),
    medium: image.replace(originalImageCropRegex, "-0-150-0-225-crop"),
    large: image.replace(originalImageCropRegex, "-0-230-0-345-crop"),
  };
}
function getReview(element) {
  const description = element.find("description").text();
  const $ = (0, cheerio_1.load)(description);
  const reviewParagraphs = $("p");
  let review = "";
  // if there is no review return the item
  if (reviewParagraphs.length <= 0) {
    return review;
  }
  // the rest of description is a review, if there is no review the string 'Watched on ' will appear
  // this assumes you didn't write the 'Watched on ' string in your review... weak
  if (reviewParagraphs.last().text().includes("Watched on ")) {
    return review;
  }
  // loop through paragraphs
  reviewParagraphs.each((i, element) => {
    const reviewParagraph = $(element).text();
    // only add paragaphs that are the review
    if (reviewParagraph !== "This review may contain spoilers.") {
      review += reviewParagraph + "\n";
    }
  });
  // tidy up and add review to the item
  review = review.trim();
  return review;
}
function getListFilms(element) {
  const description = element.find("description").text();
  const $ = (0, cheerio_1.load)(description);
  const films = [];
  $("li a").each((i, filmElement) => {
    films.push({
      title: $(filmElement).text(),
      uri: $(filmElement).attr("href"),
    });
  });
  return films;
}
function getListDescription(element) {
  const description = element.find("description").text();
  const $ = (0, cheerio_1.load)(description);
  let result = "";
  // if there are no paragraphs in the description there isnt one
  if ($("p").length <= 0) {
    return result;
  }
  $("p").each((i, element) => {
    // we'll assume descriptions dont have the link text in
    const text = $(element).text();
    const isntPlusMoreParagraph = !text.includes(
      "View the full list on Letterboxd"
    );
    if (isntPlusMoreParagraph) {
      result = text;
    }
  });
  return result;
}
function getListTotalFilms(element) {
  const description = element.find("description").text();
  const $ = (0, cheerio_1.load)(description);
  const films = getListFilms(element);
  let result = films.length;
  // if there are no paragraphs in the description there isnt one
  if ($("p").length <= 0) {
    return result;
  }
  $("p").each((i, paragraphElement) => {
    const text = $(paragraphElement).text();
    const isPlusMoreParagraph = text.includes(
      "View the full list on Letterboxd"
    );
    if (isPlusMoreParagraph) {
      const startNumberPositionString = "...plus ";
      const startNumberPosition =
        text.indexOf(startNumberPositionString) +
        startNumberPositionString.length;
      const endNumberPositionString =
        " more. View the full list on Letterboxd.";
      const endNumberPosition = text.indexOf(endNumberPositionString);
      const numberString = text.substring(
        startNumberPosition,
        endNumberPosition
      );
      result += parseInt(numberString, 10) || 0;
    }
  });
  return result;
}
function isListRanked(element) {
  const description = element.find("description").text();
  const $ = (0, cheerio_1.load)(description);
  const isOrderedListPresent = !!$("ol").length;
  return isOrderedListPresent;
}
function processItem(element) {
  // there are two types of items: lists and diary entries
  if (isListItem(element)) {
    return {
      type: "list",
      date: {
        published: getPublishedDate(element),
      },
      title: getTitleData(element),
      description: getListDescription(element),
      ranked: isListRanked(element),
      films: getListFilms(element),
      totalFilms: getListTotalFilms(element),
      uri: getUri(element),
    };
  }
  // otherwise return a diary entry
  return {
    type: "diary",
    date: {
      published: getPublishedDate(element),
      watched: getWatchedDate(element),
    },
    film: {
      title: getTitle(element),
      year: getYear(element),
      image: getImage(element),
    },
    rating: getRating(element),
    review: getReview(element),
    spoilers: getSpoilers(element),
    isRewatch: getIsRewatch(element),
    uri: getUri(element),
  };
}
function invalidUsername(username) {
  return !username || username.trim().length <= 0;
}
function getDiaryData(username) {
  const uri = `https://letterboxd.com/${username}/rss/`;
  return (0, node_fetch_1.default)(uri)
    .then((response) => {
      // if 404 we're assuming that the username does not exist or have a public RSS feed
      if (response.status === 404) {
        throw new Error(
          `No RSS feed found for username by "${username}" at Letterboxd`
        );
      } else if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
      return response.text();
    })
    .then((xml) => {
      const $ = (0, cheerio_1.load)(xml, { xmlMode: true });
      const items = [];
      $("item").each((i, element) => {
        items[i] = processItem($(element));
      });
      return items;
    });
}
function letterboxd(username) {
  if (invalidUsername(username)) {
    return Promise.reject(new Error("No username sent as a parameter"));
  }
  return getDiaryData(username);
}
exports.default = letterboxd;
