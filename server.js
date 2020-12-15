const rp = require("request-promise");
const cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");
var url = "https://www.meishij.net/chufang/diy/jiangchangcaipu/?&page=";
var start = 1;
const res = [];

//开始爬取页面数据
getMovies(url, start);
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
    //   rp($(ele).find("img").attr("src")).pipe(
    //     fs.createWriteStream(
    //       dir + "/" + start + "_" + $(ele).find("a").attr("title") + ".jpg"
    //     )
    //   );
    res.push({
      title: $(ele).find("a").attr("title"),
      img: $(ele).find("img").attr("src"),
      desc: $(ele).find(".li2").text(),
      type: $(ele).find(".li1").text(),
    });
  });
  if (start < 56) {
    console.log(`爬取完成第${start}页,用时${+new Date() - startTime}`);
    sleep(50);
    getMovies(url, start + 1);
  } else {
    console.log(`爬取完成`);
    fs.writeFile(
      path.resolve(__dirname, "food.json"),
      JSON.stringify(res),
      err => {
        if (err) throw err;
        console.log("JSON data is saved.");
      }
    );
  }
};
