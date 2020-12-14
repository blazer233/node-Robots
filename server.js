const rp = require("request-promise");
const cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");
var start = 0;
var url = "https://movie.douban.com/top250?start=";
var end = "&filter=";
const getMovies = async (url, start, end) => {
  const opts = {
    url: `${url}${start}${end}`,
    transform: body => cheerio.load(body),
  };
  var top250 = [];
  let $ = await rp(opts);
  $("li>.item>.info").each((index, ele) => {
    var movie = {
      picture: $(ele).prev().find("img").attr("src"),
      title: $(ele)
        .children(".hd")
        .text()
        .replace(/[\r\n]/g, "")
        .replace(/\ +/g, ""),
      details: $(ele)
        .children(".bd")
        .find(".star")
        .prev()
        .text()
        .replace(/[\r\n]/g, "")
        .replace(/\ +/g, ""),
      score: $(ele).children(".bd").find(".star").find(".rating_num").text(),
      nums: $(ele)
        .children(".bd")
        .find(".star")
        .find(".rating_num")
        .next()
        .next()
        .text()
        .replace(/[\r\n]/g, "")
        .replace(/\ +/g, ""),
      quote: $(ele)
        .children(".bd")
        .find(".quote")
        .text()
        .replace(/[\r\n]/g, "")
        .replace(/\ +/g, ""),
    };
    top250.push(movie);
  });

  fs.appendFile(
    path.resolve(__dirname, "data.json"),
    JSON.stringify(top250),
    () => {
      console.log("保存成功");
    }
  );
  if (start < 225) {
    getMovies(url, start + 25, end);
  } else {
    console.log("爬取成功！");
  }
};

//开始爬取页面数据
getMovies(url, start, end);
