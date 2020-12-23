const puppeteer = require("puppeteer");
const iPhone = puppeteer.devices["iPhone 6"];
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto("http://www.baidu.com", {
    waitUntil: "networkidle2", // 网络空闲说明已加载完毕
  });
  await page.type("#index-kw", "puppeteer");
  await page.click("#index-bn");
  await page.waitForNavigation({ timeout: 3000 });

  await page.screenshot({
    path: "baidu_iphone_X_search_puppeteer.png",
  });
})();
