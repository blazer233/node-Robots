const rp = require("request-promise");
const cheerio = require("cheerio");
const config = require("./config");
var fs = require("fs");
var path = require("path");
const errors = [];
const success = [];
const photo = [];
var start = 1;
const opts = ({ url, transform }) => ({
  "X-Forwarded-For": config.returnIp(),
  "User-Agent": config.randomHead(),
  transform,
  url,
});
const getMovies = async start => {
  console.log(`开始爬取第${start}页`);
  const url = `http://sy.cndesign.com/list_${start}.html`;
  const startTime = +new Date();
  let $ = await rp(opts({ url, transform: body => cheerio.load(body) }));
  $(".c-l_ul.clear>li").each(async (index, ele) => {
    let src = $(ele).find(".pl_img_box a").attr("href");
    let _$ = await rp(
      opts({
        url: src,
        transform: body => cheerio.load(body),
      })
    );
    _$(".crop_img img").each((_index, el) => {
      let _url = _$(el).attr("src") && _$(el).attr("src");
      let name = index + _$(el).attr("title") + _index + ".jpeg";
      let out = fs.createWriteStream(path.resolve(__dirname + "/imgs", name));
      rp(opts({ url: _url })).pipe(out);
      out.on("error", err => {
        errors.push(0);
        console.log(`错误原因：${err} 共出错${errors.length}张`);
      });
    });
  });

  if (start < 20) {
    console.log(`爬取完成第${start}页,用时${+new Date() - startTime}`);
    getMovies(start + 1);
  } else {
    console.log("完成");
  }
};

//开始爬取页面数据
getMovies(start);
