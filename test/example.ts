/* eslint-disable no-console */
import letterboxd from "../index";


letterboxd("zeromero")
  //@ts-ignore
  .then((items) => logItems(items))
  .catch((error) => console.log(error));

function logItems(items) {
  const diaryEntries = items.filter((item) => item.type === "diary");
  const lists = items.filter((item) => item.type === "list");

  console.log("");

  console.log(`Diary entries (${diaryEntries.length}):\n`);

  diaryEntries.map((diaryEntry) => {
    console.log(`  + ${diaryEntry.film.title} (${diaryEntry.uri})\n`);
  });

  console.log(`\nLists (${lists.length}):\n`);

  lists.map((list) => {
    console.log(`  + ${list.title} (${list.uri})\n`);
  });

  console.log("");
}
