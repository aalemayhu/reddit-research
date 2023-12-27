import fs from "fs";

import cheerio from "cheerio";

async function getData(url) {
  const response = await fetch(url);
  const html = await response.text();
  return html;
}

async function main() {
  let xml;
  try {
    xml = await getData("https://redditlist.com/sfw.html");
  } catch (error) {
    console.error(error);
    console.info("Failed to download html");
  }

  const doc = cheerio.load(xml);
  const subredditListItems = doc(".listing-item");
  const cleanName = (name) => name.replace(/^\si\s/, "");

  for (const listItem of subredditListItems) {
    const entry = doc(listItem);
    const name = entry.find(".sfw").text();
    const subscribers = entry.find(".listing-stat").text();
    if (!name || !subscribers) {
      continue;
    }
    console.log(cleanName(name), subscribers);
  }
}

main();
