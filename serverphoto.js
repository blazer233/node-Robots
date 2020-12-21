const rp = require("request-promise");
const cheerio = require("cheerio");
const config = require("./config");
var fs = require("fs");
var path = require("path");
const errors = [];
const success = [];
const photo = [];
var start = 1;
// const sleep = numberMillis => {
//   const exitTime = +new Date() + numberMillis;
//   while (true) {
//     if (+new Date() > exitTime) return;
//   }
// };
const opts = ({ url, transform }) => ({
  "X-Forwarded-For": config.returnIp(),
  "User-Agent": config.randomHead(),
  transform,
  url,
});
const getMovies = async start => {
  try {
    const startTime = +new Date();
    console.log(`开始爬取第${start}页`);
    const url = `http://www.cndesign.com/opus/list_${start}.html`;
    let $ = await rp(opts({ url, transform: body => cheerio.load(body) }));
    $(".img_box.crop_img").each(async (i, el) => {
      let urls = "http://www.cndesign.com" + $(el).attr("href");
      let _$ = await rp(
        opts({ url: urls, transform: body => cheerio.load(body) })
      );
      _$(".crop_img img").each((_i, _el) => {
        let _url = _$(_el).attr("src");
        let name = i + "_" + _$(_el).attr("alt") + "_" + _i + ".jpg";
        let out = fs.createWriteStream(
          path.resolve(__dirname + "/photo", name)
        );
        rp(opts({ url: _url })).pipe(out);
        out.on("error", err => {
          errors.push(0);
          console.log(`错误原因：${err} 共出错${errors.length}张`);
        });
        out.on("finsh", () => {
          success.push(1);
          console.log(`下载${name}成功,共下载${success.length}张`);
        });
      });
    });
    if (start < 10) {
      console.log(`爬取完成第${start}页,用时${+new Date() - startTime}`);
      getMovies(start + 1);
    } else {
      console.log(
        `下载完成 一共成功${success.length}张，失败${errors.length}张`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
//开始爬取页面数据
getMovies(start);
