import fs from "fs";

import cheerio from "cheerio";

async function getData(url) {
  const response = await fetch(url);
  const html = await response.text();
  return html;
}

function cleanName(name) {
  return name.replace(/^\si\s/, "");
}

function cleanNumber(value) {
  return value.replace(/[^0-9]/g, "");
}

async function main() {
  const csvOutputPath = "subreddits-" + new Date().getMilliseconds() + ".csv";
  let csvOutput = "Subreddit,Subscribers";
  let xml;

  try {
    xml = await getData("https://redditlist.com/sfw.html");
  } catch (error) {
    console.error(error);
    console.info("Failed to download html");
  }

  const doc = cheerio.load(xml);
  const subredditListItems = doc(".listing-item");

  for (const listItem of subredditListItems) {
    const entry = doc(listItem);
    const name = entry.find(".sfw").text();
    const subscribers = entry.find(".listing-stat").text();
    if (!name || !subscribers) {
      continue;
    }
    const line = cleanName(name) + "," + cleanNumber(subscribers);
    csvOutput += line;
  }
  fs.writeFileSync(csvOutputPath, csvOutput);
  console.log("Written to", csvOutputPath);
}

main();
