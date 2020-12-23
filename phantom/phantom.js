const phantom = require("phantom");
const cheerio = require("cheerio");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const rp = require("request-promise");
const photo = [];
const errors = [];
var start = 1;
const opts = ({ url }) => ({
  "X-Forwarded-For": config.returnIp(),
  "User-Agent": config.randomHead(),
  url,
});
const phantom_ = async start => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  //   await page.on("onResourceRequested", function (requestData) {
  //     console.info("Requesting", requestData.url);
  //   });

  page.property("customHeaders", {
    "X-Forwarded-For": config.returnIp(),
    "User-Agent": config.randomHead(),
  });
  const status = await page.open("http://www.dili360.com/gallery/");
  console.info("当前状态：" + status);
  const content = await page.property("content");
  const $ = cheerio.load(content);
  $(".right-side li .img a").each(async (index, el) => {
    const _page = await instance.createPage();
    _page.property("customHeaders", {
      "X-Forwarded-For": config.returnIp(),
      "User-Agent": config.randomHead(),
    });
    const _status = await _page.open(
      "http://www.dili360.com" + $(el).attr("href")
    );
    console.info("子页面当前状态：" + _status);
    const _content = await _page.property("content");
    const _$ = cheerio.load(_content);
    _$(".ship li").each(async (_index, _el) => {
      console.log(`正在爬取第${index}页`);
      let _url = _$(_el).attr("data-source");
      let name = _$(_el).attr("data-text") + "_" + _index + ".jpg";
      let out = fs.createWriteStream(path.resolve(__dirname + "/photo", name), {
        autoClose: true,
      });
      rp(opts({ url: _url })).pipe(out);
      out.on("error", err => {
        errors.push(0);
        console.log(`错误原因：${err.stack} 共出错${errors.length}张`);
      });
      await instance.exit();
    });
  });
};
phantom_();
