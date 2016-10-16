var letterboxd = require('./index');

letterboxd('zaccolley', function(error, items){
  if (error) {
    return console.log(error);
  }

  logItems(items);
});

function logItems(items) {
  var diaryEntries = items.filter(item => item.type === 'diary');
  var lists = items.filter(item => item.type === 'list');

  console.log('');
  console.log('Amount of diary entries: ' + diaryEntries.length);
  console.log('Amount of lists: ' + lists.length);

  console.log('\nDiary entries:\n');

  diaryEntries.map(diaryEntry => {
    console.log('  + ' + diaryEntry.film.title + ' (' + diaryEntry.uri + ')');
  });

  console.log('\nLists:\n');

  lists.map(list => {
    console.log('  + ' + list.title + ' (' + list.uri + ')');
  });

  console.log('');
}
