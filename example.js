var letterboxd = require('./letterboxd');

letterboxd('jason_alley', function(error, items){
  if (error) {
    return console.log(error);
  }

  console.log(items);
});
