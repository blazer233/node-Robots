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
  console.log(`开始爬取第${start}页`);
  const url = `https://www.istockphoto.com/photos/girl?mediatype=photography&page=${start}&phrase=girl&sort=best`;
  const startTime = +new Date();
  let $ = await rp(opts({ url, transform: body => cheerio.load(body) }));
  $("li.item").each(async (index, ele) => {
    let src = $(ele).find("a").attr("href");
    let name = start + "_" + $(ele).find("a").attr("title") + "_.jpg";
    let $_ = await rp(
      opts({
        url: `https://www.freeimages.com${src}`,
        transform: body => cheerio.load(body),
      })
    );
    photo.push({ url: $_(".preview img").attr("src"), name });
  });

  if (start < 10) {
    console.log(`爬取完成第${start}页,用时${+new Date() - startTime}`);
    getMovies(start + 1);
  } else {
    let successPhoto = photo.filter(({ url }) => url);
    let errlen = photo.length - successPhoto.length;
    console.log(
      `一共${photo.length}张，成功${successPhoto.length}张,失败${errlen}张`
    );
    console.log(`开始下载`);
    successPhoto.map(({ url, name }) => {
      let out = fs.createWriteStream(path.resolve(__dirname + "/img", name), {
        autoClose: true,
      });
      rp(opts({ url })).pipe(out);
      out.on("error", err => {
        errors.push(0);
        console.log(`错误原因：${err} 共出错${errors.length}张`);
      });
      out.on("finsh", err => {
        success.push(1);
        console.log(`下载成功`);
      });
    });
    console.log(`下载完成 一共成功${success.length}张，失败${errors.length}张`);
  }
};

//开始爬取页面数据
getMovies(start);
