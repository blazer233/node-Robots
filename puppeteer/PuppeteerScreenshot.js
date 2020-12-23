const viewPort = { width: 2560, height: 1440 };
const options = {
  path: "clipped_stocktickers.png",
  // fullPage: false,
  // clip: {
  //   x: 0,
  //   y: 240,
  //   width: 1000,
  //   height: 100,
  // },
};

const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage(); //await browser.pages())[1]
  await page.setViewport(viewPort);
  await page.goto("https://www.baidu.com/");
  await page.screenshot(options);
  // await browser.close();
})();
