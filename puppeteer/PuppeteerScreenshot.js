const viewPort = { width: 2560, height: 1440 };
const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage(); //await browser.pages())[1]
  await page.goto("https://www.baidu.com/");
  const wh = await page.evaluate(() => {
    return {
      width: window.document.body.clientWidth,
      height: window.document.body.clientHeight,
    };
  });
  const options = {
    path: "clipped_stocktickers.png",
    fullPage: false,
    ...wh,
  };
  console.log(wh);
  await page.setViewport(wh);
  await page.screenshot(options);
  await browser.close();
})();
