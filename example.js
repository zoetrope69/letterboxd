var letterboxd = require('./index');

letterboxd('rubencordeiro')
  .then(function(items) {
    console.log(items);
  })
  .catch(function(error) {
    console.log(error);
  });

letterboxd('zaccolley', function(error, items){
  if (error) {
    return console.log(error);
  }

  console.log(items);
});
