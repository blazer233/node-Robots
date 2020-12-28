/**
 * 选取元素使用await page.$(".next");而不是await page.$eval(".next");
 * 点击事件先选取元素再点击
 *   const next = await page.$(".next");
     await next.click();
     而不是
     await page.click(".next", { delay: 20 });
 */
const fs = require("fs");
const rp = require("request-promise");
const path = require("path");
const { sleep, returnIp, randomHead } = require("../config");
const puppeteer = require("puppeteer");
var start = 1;
var msg = [];
const opts = ({ url }) => ({
  "X-Forwarded-For": returnIp(),
  "User-Agent": randomHead(),
  url,
});
const down = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.guazi.com/sz/buy/o1/#bread`);
  const len = await page.evaluate(
    el => Number($(el).eq(-2).text()),
    ".pageLink.clearfix > li"
  );
  for (let i = start; i < len; i++) {
    console.log(i);
    console.log(msg.length);
    const brands = await page.evaluate(
      el =>
        [...$(el)].map(i => ({
          href: i.children[0].src.replace(/\s/g, "").trim(),
          text: i.children[1].textContent.replace(/\s/g, "").trim(),
          dsc: i.children[2].textContent.replace(/\s/g, "").trim(),
          price: i.children[3].textContent.replace(/\s/g, "").trim(),
        })),
      ".carlist.clearfix.js-top > li > a"
    );
    msg = [...msg, ...brands];
    await page.waitForSelector(".next", { visible: true }); //等待id为login_field的元素出现继续执行
    const next = await page.$(".next");
    await sleep(1000);
    await next.click();
    await page.waitForNavigation({ waitUntil: "load" });
  }
  console.log("汽车总数: ", msg.length);

  let writerStream = fs.createWriteStream("car_.json");
  writerStream.write(JSON.stringify(msg, undefined, 2), "UTF8");
  writerStream.end();

  //   msg.map(({ href: url, text: t, dsc: d, price: p }) => {
  //     let out = fs.createWriteStream(
  //       path.resolve(__dirname + "/photo", `${t}_${d}_${p}_.jpg`),
  //       {
  //         autoClose: true,
  //       }
  //     );
  //     rp(opts({ url })).pipe(out);
  //     out.on("error", err => {
  //       console.log(`错误原因：${err.stack} 共出错${errors.length}张`);
  //     });
  //   });
  browser.close();
};
down(start);
