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
const json = require("./photossss.json");
const rp = require("request-promise");
const fs = require("fs");
const { Sleep, returnIp, randomHead } = require("../config");
const puppeteer = require("puppeteer");
const path = require("path");
var msg = [];
var error = [];
var res = [];
var PageUrl = [];
var AllUrl = [];
const opts = ({ url }) => ({
  // "X-Forwarded-For": returnIp(),
  // "User-Agent": randomHead(),
  url,
});
const down = async () => {
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(`http://m.dili360.com/gallery`);
  // PageUrl = await page.$$eval(".gallery-cate-list li[class=''] a", el =>
  //   el.map(i => "http://m.dili360.com" + i.getAttribute("href"))
  // );
  // for (let i = 0; i < PageUrl.length; i++) { 
  //   await page.goto(PageUrl[i]);
  //   const manyPage = await page.$$eval(".pagination li", el => el.length);
  //   const pageArr = manyPage
  //     ? await page.$$eval(".pagination a", el =>
  //         el
  //           .slice(0, -1)
  //           .map(i => "http://m.dili360.com" + i.getAttribute("href"))
  //       )
  //     : [];
  //   AllUrl.push(...pageArr, PageUrl[i]);
  // }
  // console.log(`画廊所有地址爬取成功，一共${AllUrl.length}个网址`);
  // for (let i = 0; i < AllUrl.length; i++) {
  //   await page.goto(AllUrl[i]);
  //   const img = await page.evaluate(
  //     el => Array.from($(el)).map(i => i.getAttribute("href")),
  //     ".right-side li a"
  //   );
  //   console.log(
  //     `----搜索成功,第${i + 1}、网址：${AllUrl[i]} 一共${img.length}组照片----`
  //   );
  //   for (let y = 0; y < img.length; y++) {
  //     console.log(`----正在爬取第${i + 1}个网址中的第${y + 1}组----`);
  //     await page.goto(`http://m.dili360.com/${img[y]}`);
  //     sleep(1000);
  //     const imgs = await page.evaluate(
  //       el =>
  //         Array.from($(el)).map((i_, index) => ({
  //           oder: index + 1,
  //           href: i_.getAttribute("data-source").replace(/\s/g, "").trim(),
  //           text: i_.getAttribute("data-text").replace(/\s/g, "").trim(),
  //         })),
  //       ".ship li"
  //     );
  //     msg = [...msg, ...imgs];
  //   }
  //   console.log(`当前照片一共${msg.length}张`);
  // }

  // console.log(`----爬取成功，开始下载----`);
  // let writerStream = fs.createWriteStream("photossss.json");
  // writerStream.write(JSON.stringify(msg, undefined, 2), "UTF8");
  // writerStream.end();
  console.log(json.length);
  let result_ = json.map(({ href, text }, index) => ({
    href,
    text: text ? text : `第${index}张`,
  }));
  for (let i = 0; i < result_.length; i++) {
    Sleep(1000);
    console.log(`---------下载第${i + 1}张------一共${result_.length}张`);
    let out = fs.createWriteStream(
      path.resolve(__dirname + "/photo", `${result_[i]["text"]}_${i + 1}_.jpg`),
      {
        autoClose: true,
      }
    );
    rp(opts({ url: result_[i]["href"] })).pipe(out);
    out.on("error", err => {
      error.push(0);
      console.log(`错误：地址：${result_[i]["href"]} 共出错${error.length}张`);
    });
  }
  // msg.map(({ href: url, text: t, oder }) => {
  //   let out = fs.createWriteStream(
  //     path.resolve(__dirname + "/photo", `${oder}_${t}_.jpg`),
  //     {
  //       autoClose: true,
  //     }
  //   );
  //   rp(opts({ url })).pipe(out);
  //   out.on("error", err => {
  //     error.push(0);
  //     console.log(
  //       `错误原因：${err.stack} 地址：${url} 共出错${error.length}张`
  //     );
  //   });
  // });
  // browser.close();
};
down();
