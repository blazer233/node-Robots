const puppeteer = require("puppeteer");
const { sleep } = require("../config");
puppeteer.launch().then(async browser => {
  console.log(`----解析网页---`);
  let page = await browser.newPage();
  await page.goto("http://es6.ruanyifeng.com/#README");
  let Tags = await page.evaluate(() => {
    return [
      ...document.querySelectorAll("ol li a"),
    ].map(({ href, innerText }) => ({ href, innerText }));
  });
  await page.on("console", () => console.log(`----开始爬取---`));
  Tags.forEach(async ({ innerText, href }, index) => {
    start = +new Date();
    let _page = await browser.newPage();
    await _page.on("console", () =>
      console.log(
        "----正在下载----:" + innerText + "用时:" + (+new Date() - start)
      )
    );
    await _page.goto(href);
    await sleep(1000);
    await _page.pdf({ path: `./es6-pdf/${index + 1}_${innerText}.pdf` });
    await _page.close();
  });
  await page.on("console", () => console.log("----下载完成----"));
  await page.close();
});
