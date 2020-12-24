const puppeteer = require("puppeteer");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
(async () => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto("http://m.dili360.com/gallery/540.htm");
  const imageHref = await page.evaluate(
    el => ({
      url: document.querySelector(el + ">img").getAttribute("src"),
      title: document.querySelector(el + " span.desc-text").innerText,
    }),
    ".inline-block"
  );
  const viewSource = await page.goto(imageHref.url);
  const buffer = await viewSource.buffer();
  await writeFileAsync(path.join(__dirname, imageHref.title + ".png"), buffer);
  console.log("The file was saved!");

  await readFileAsync(path.join(__dirname, imageHref.title + ".png"));
  console.log("The file was read!");
  browser.close();
})();
