const rp = require("request-promise");
const cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");
var url = "https://www.meishij.net/chufang/diy/jiangchangcaipu/?&page=";
var start = 1;
const sleep = numberMillis => {
  const exitTime = +new Date() + numberMillis;
  while (true) {
    if (+new Date() > exitTime) return;
  }
};
const getMovies = async (url, start) => {
  console.log(`开始爬取第${start}页`);
  const startTime = +new Date();
  const opts = {
    url: `${url}${start}`,
    transform: body => cheerio.load(body),
  };
  let $ = await rp(opts);
  $("#listtyle1_list > div").each((index, ele) => {
    let src = $(ele).find("img").attr("src");
    let name = start + "_" + $(ele).find("a").attr("title") + ".jpg";
    rp(src).pipe(fs.createWriteStream(path.resolve(__dirname + "/img", name)));
  });

  if (start < 56) {
    console.log(`爬取完成第${start}页,用时${+new Date() - startTime}`);
    sleep(50);
    getMovies(url, start + 1);
  } else {
    console.log(`爬取完成`);
  }
};

//开始爬取页面数据
getMovies(url, start);
