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
  const url = `http://www.cndesign.com/opus/85d0b244-7c3b-4f32-8d74-ac7600e1d00f.html`;
  let $ = await rp(opts({ url, transform: body => cheerio.load(body) }));
  $(".crop_img img").each((index, el) => {
    photo.push({
      url: $(el).attr("src"),
      name: $(el).attr("title") + index + ".jpeg",
    });
  });

  // if (start < 2) {
  //   console.log(`爬取完成第${start}页,用时${+new Date() - startTime}`);
  //   getMovies(start + 1);
  // } else {
  // let successPhoto = photo.filter(({ url }) => url);
  // let errlen = photo.length - successPhoto.length;
  // console.log(
  //   `一共${photo.length}张，成功${successPhoto.length}张,失败${errlen}张`
  // );
  // console.log(`开始下载`);
  // successPhoto.map(({ url, name }) => {
  //   let out = fs.createWriteStream(path.resolve(__dirname + "/img", name));
  //   rp(opts({ url })).pipe(out);
  //   out.on("error", err => {
  //     errors.push(0);
  //     console.log(`错误原因：${err} 共出错${errors.length}张`);
  //   });
  //   out.on("finsh", err => {
  //     success.push(1);
  //     console.log(`下载成功`);
  //   });
  // });
  // console.log(`下载完成 一共成功${success.length}张，失败${errors.length}张`);
  console.log(photo);
  // }
};

//开始爬取页面数据
getMovies(start);
