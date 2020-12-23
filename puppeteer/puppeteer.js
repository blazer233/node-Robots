const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const cookie = {
  name: "login_email",
  value: "set_by_cookie@domain.com",
  domain: ".paypal.com",
  url: "https://www.paypal.com/",
  path: "/",
  httpOnly: true,
  secure: true,
};
let scrape = async () => {
  const browser = await puppeteer.launch(); //打开新的浏览器
  const page = await browser.newPage(); // 打开新的网页
  // await page.setCookie(cookie); //设置cookie
  await page.goto("https://www.baidu.com/"); //前往里面 'url' 的网页
  const content = await page.evaluate(
    () => document.querySelector("body").innerHTML
  );
  const $ = await cheerio.load(content);
  console.log($("#su").attr("value"));
  browser.close();
};

scrape();
