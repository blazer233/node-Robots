/**
 * 选取元素使用await page.$(".next");而不是await page.$eval(".next");
 * await page.$eval(".next");只能用于获取属性
 * await page.$(".next")判断存在，不用waitForSelector
 * 点击事件先选取元素再点击
 *   const next = await page.$(".next");
     await next.click();
     而不是
     await page.click(".next", { delay: 20 });
     page.goBack 回退
 */
const rp = require("request-promise");
const fs = require("fs");
const { sleep, returnIp, randomHead } = require("../config");
const puppeteer = require("puppeteer");
const path = require("path");
var msg = [];
var error = [];
var result = [];
const opts = ({ url }) => ({
  "X-Forwarded-For": returnIp(),
  "User-Agent": randomHead(),
  url,
});
const down = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://desk.zol.com.cn/meinv");
  await page.waitForSelector(".pic", { visible: true }); //等待id为login_field的元素出现继续执行
  const arr = await page.$$eval(".pic", el =>
    el.map((i, index) =>
      i.getAttribute("href").includes("http")
        ? { href: i.getAttribute("href"), index }
        : { href: "http://desk.zol.com.cn" + i.getAttribute("href"), index }
    )
  );
  console.log(`----当前页面有${arr.length}组----${new Date()}`);
  for (let i = 0; i < arr.length; i++) {
    console.log(
      `-正在爬取第${i + 1}组--${new Date()}--下载地址：${arr[i].href}`
    );
    await page.goto(arr[i].href);
    const imgs = await page.$$eval("#showImg li a", el =>
      el.map(i => i.getAttribute("href"))
    );
    msg = [...msg, ...imgs];
  }
  console.log(`----所有${msg.length}组----`);
  for (let i = 0; i < msg.length; i++) {
    try {
      await page.goto("http://desk.zol.com.cn" + msg[i]);
      await page.waitForSelector("#tagfbl", { visible: true });
      const hrefTitle = await page.$eval("#titleName", el => el.innerText);
      const hrefItems = await page.$eval(
        "#tagfbl",
        el => el.children[2] && el.children[2].href
      );
      console.log(
        `----正在爬取所有照片第${i + 1}组-----${hrefItems}----${new Date()}`
      );
      await page.goto(hrefItems);
      await page.waitForSelector("body img", { visible: true });
      const hrefItem = await page.$eval("body img", el => el.src);
      sleep(1000);
      console.log(`------下载地址：${hrefItem}`);
      let out = fs.createWriteStream(
        path.resolve(__dirname + "/photosall", `${hrefTitle}_${i}_.jpg`),
        {
          autoClose: true,
        }
      );
      rp(opts({ url: hrefItem })).pipe(out);
      out.on("error", err => {
        error.push(0);
        console.log(`错误原因：${err.stack} 共出错${error.length}张`);
      });
    } catch (error) {
      console.log("error: " + error);
    }

    // result.push({
    //   hrefTitle: `${hrefTitle}_${i}`,
    //   hrefItem,
    // });
  }

  // let writerStream = fs.createWriteStream("photos.json");
  // writerStream.write(JSON.stringify(result, undefined, 2), "UTF8");
  // writerStream.end();
  // console.log(`----爬取成功，开始下载----${new Date()}`);
  // result.map(({ hrefItem: url, hrefTitle: t, oder }) => {
  //   let out = fs.createWriteStream(
  //     path.resolve(__dirname + "/photos", `${oder}_${t}_.jpg`),
  //     {
  //       autoClose: true,
  //     }
  //   );
  //   rp(opts({ url })).pipe(out);
  //   out.on("error", err => {
  //     error.push(0);
  //     console.log(`错误原因：${err.stack} 共出错${error.length}张`);
  //   });
  // });

  console.log(`----over----${new Date()}`);
  browser.close();
};
down();
