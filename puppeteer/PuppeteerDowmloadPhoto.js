/**
 * 选取元素使用await page.$(".next");而不是await page.$eval(".next");
 * await page.$eval(".next");只能用于获取属性
 * 点击事件先选取元素再点击
 *   const next = await page.$(".next");
     await next.click();
     而不是
     await page.click(".next", { delay: 20 });
     page.goBack 回退
 */
const rp = require("request-promise");
const fs = require("fs");
const { sleep } = require("../config");
const puppeteer = require("puppeteer");
const path = require("path");
var msg = [];
var error = [];
const opts = ({ url }) => ({
  // "X-Forwarded-For": returnIp(),
  // "User-Agent": randomHead(),
  url,
});
const down = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://m.dili360.com/gallery/cate/9.htm`);
  const img = await page.evaluate(
    el => Array.from($(el)).map(i => i.getAttribute("href")),
    ".right-side li a"
  );

  console.log(`----搜索成功，一共${img.length}组----`);
  for (let i = 0; i < img.length; i++) {
    console.log(`----正在爬取第${i + 1}组----`);
    await page.goto(`http://m.dili360.com/${img[i]}`);
    sleep(1000);
    const imgs = await page.evaluate(
      el =>
        Array.from($(el)).map((i, index) => ({
          oder: index + 1,
          href: i.getAttribute("data-source").replace(/\s/g, "").trim(),
          text: i.getAttribute("data-text").replace(/\s/g, "").trim(),
        })),
      ".ship li"
    );
    msg = [...msg, ...imgs];
    console.log(msg.length);
  }
  console.log(`----爬取成功，开始下载----`);
  msg.map(({ href: url, text: t, oder }) => {
    let out = fs.createWriteStream(
      path.resolve(__dirname + "/photo", `${oder}_${t}_.jpg`),
      {
        autoClose: true,
      }
    );
    rp(opts({ url })).pipe(out);
    out.on("error", err => {
      error.push(0);
      console.log(`错误原因：${err.stack} 共出错${error.length}张`);
    });
  });
  browser.close();
};
down();
