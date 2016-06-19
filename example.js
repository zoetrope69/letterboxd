var letterboxd = require('./index');

letterboxd('zaccolley', function(error, items){
  if (error) {
    return console.log(error);
  }

  console.log(items);
});
