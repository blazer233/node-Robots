const phantom = require("phantom");
const cheerio = require("cheerio");
const config = require("./config");
const fs = require("fs");
const path = require("path");
const rp = require("request-promise");
const errors = [];
const header = {
  "X-Forwarded-For": config.returnIp(),
  "User-Agent": config.randomHead(),
};
const page = 1;
const phantom_ = async page => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on("onResourceRequested", function (requestData) {
    console.info("Requesting", requestData.url);
  });

  page.property("customHeaders", header);
  const status = await page.open(
    `https://photo.poco.cn/?classify_type=${page}&works_type=medal`
  );
  console.info("当前状态：" + status);
  const content = await page.property("content");
  const $ = cheerio.load(content);
  $(".photo-list-padding a").each(async (index, el) => {
    const _page = await instance.createPage();
    _page.property("customHeaders", {
      "X-Forwarded-For": config.returnIp(),
      "User-Agent": config.randomHead(),
    });
    const _status = await _page.open(
      "http://desk.zol.com.cn" + $(el).attr("href")
    );
    console.info("子页面当前状态：" + _status);
    const _content = await _page.property("content");
    const _$ = cheerio.load(_content);
    _$("#showImg li a").each(async (_index, _el) => {
      const name = index + _index + ".jpg";
      console.log(`正在爬取第 ${index} 页`);
      const _page_ = await instance.createPage();
      const _status_ = await _page_.open(
        "http://desk.zol.com.cn" + _$(_el).attr("href")
      );
      console.info("孙页面当前状态：" + _status_);
      const _content_ = await _page_.property("content");
      const _$_ = cheerio.load(_content_);
      const _page_load = await instance.createPage();
      const _status_load = await _page_load.open(
        "http://desk.zol.com.cn" + _$_("#tagfbl #2560x1440").attr("href")
      );
      console.info("下载页面当前状态：" + _status_load);
      const _content_load = await _page_load.property("content");
      const _$_load = cheerio.load(_content_load);
      let _url = _$_load("img").eq(0).attr(src);
      let out = fs.createWriteStream(path.resolve(__dirname + "/photo", name));
      rp(opts({ url: _url })).pipe(out);
      out.on("error", err => {
        errors.push(0);
        console.log(`错误原因：${err.stack} 共出错${errors.length}张`);
      });
    });
  });
};
phantom_();
