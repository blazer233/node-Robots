const rp = require("request-promise");
const cheerio = require("cheerio");
const getMovies = async () => {
  const url = `https://stock.tuchong.com/search?term=%E6%A1%83%E5%AD%90`;
  let $ = await rp({ url, transform: body => cheerio.load(body) });
  console.log($(".images-gallery a"));
};

//开始爬取页面数据
getMovies();
