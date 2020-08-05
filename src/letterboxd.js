const fetch = require("node-fetch");
const cheerio = require("cheerio");

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

function getSpoilers(element) {
  const titleData = getTitleData(element);

  const containsSpoilersString = "(contains spoilers)";
  return titleData.includes(containsSpoilersString);
}

function getRating(element) {
  const titleData = getTitleData(element);
  const spoilers = getSpoilers(element);

  const rating = {
    text: "None",
  };

  const ratingStringPosition = titleData.lastIndexOf("-");

  // if there is no '-' character there is no rating
  if (ratingStringPosition !== -1) {
    let endPosition = titleData.length;
    if (spoilers) {
      const containsSpoilersString = "(contains spoilers)";
      endPosition = endPosition - containsSpoilersString.length - 1;
    }
    rating.text = titleData.substring(ratingStringPosition + 2, endPosition);
  }

  // give a number score for the text that matches
  const score2Text = {
    None: -1.0,
    "½": 0.5,
    "★": 1.0,
    "★½": 1.5,
    "★★": 2.0,
    "★★½": 2.5,
    "★★★": 3.0,
    "★★★½": 3.5,
    "★★★★": 4.0,
    "★★★★½": 4.5,
    "★★★★★": 5.0,
  };
  rating.score = score2Text[rating.text];

  return rating;
}

function getTitleYearData(element) {
  const titleData = getTitleData(element);
  const rating = getRating(element);
  const ratingStringPosition = titleData.lastIndexOf("-");

  // if there is no rating titleAndYear is the whole string
  if (typeof rating.score === "undefined" || rating.score === -1) {
    return titleData;
  } else {
    return titleData.substring(0, ratingStringPosition - 1);
  }
}

function getTitle(element) {
  const titleData = getTitleData(element);
  const titleAndYear = getTitleYearData(element);
  const lastComma = titleAndYear.lastIndexOf(",");
  return titleData.substring(0, lastComma);
}

function getYear(element) {
  const titleData = getTitleData(element);
  const titleAndYear = getTitleYearData(element);
  const lastComma = titleAndYear.lastIndexOf(",");
  return titleData.substring(lastComma + 2, titleAndYear.length);
}

function getImage(element) {
  const description = element.find("description").text();
  const $ = cheerio.load(description);

  // find the film poster and grab it's src
  const image = $("p img").attr("src");

  // if the film has no image return no object
  if (!image) {
    return {};
  }

  return {
    tiny: image.replace("-0-150-0-225-crop", "-0-35-0-50-crop"),
    small: image.replace("-0-150-0-225-crop", "-0-70-0-105-crop"),
    medium: image,
    large: image.replace("-0-150-0-225-crop", "-0-230-0-345-crop"),
  };
}

function getReview(element) {
  const description = element.find("description").text();

  const $ = cheerio.load(description);

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
  const $ = cheerio.load(description);

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
  const $ = cheerio.load(description);

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
  const $ = cheerio.load(description);

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
  const $ = cheerio.load(description);

  const isOrderedListPresent = !!$("ol").length;
  return isOrderedListPresent;
}

function processItem(element) {
  // there are two types of items: lists and diary entries

  if (isListItem(element)) {
    // return a list
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
    uri: getUri(element),
  };
}

function invalidUsername(username) {
  return !username || username.trim().length <= 0;
}

function getDiaryData(username) {
  const uri = `https://letterboxd.com/${username}/rss/`;

  return fetch(uri)
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
      const $ = cheerio.load(xml, { xmlMode: true });

      const items = [];

      $("item").each((i, element) => {
        items[i] = processItem($(element));
      });

      return items;
    });
}

function letterboxd(username) {
  // check if a valid username has been passed in
  if (invalidUsername(username)) {
    return Promise.reject(new Error("No username sent as a parameter"));
  }

  return getDiaryData(username);
}

module.exports = letterboxd;
