const rp = require("request-promise");
const cheerio = require("cheerio");
const url = "https://movie.douban.com";
const debug = require("debug")("movie:read");
const read = async url => {
  debug("开始读取最近上映的电影");
  const opts = {
    url,
    transform: body => cheerio.load(body),
  };
  let $ = await rp(opts);
  let result = []; // 结果数组
  $("#screening li.ui-slide-item").each((index, item) => {
    let ele = $(item);
    let name = ele.data("title");
    let score = ele.data("rate") || "暂无评分";
    let href = ele.find(".poster a").attr("href");
    let image = ele.find("img").attr("src");
    let id = href && href.match(/(\d+)/)[1];
    image = image && image.replace(/jpg$/, "webp");

    if (!name || !image || !href) return;

    result.push({
      name,
      score,
      href,
      image,
      id,
    });
    debug(`正在读取电影：${name}`);
  });
  return result;
};

const start = async url => {
  let res = await read(url);
  console.log(res);
};
start(url);
