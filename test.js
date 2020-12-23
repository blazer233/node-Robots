const rp = require("request-promise");
const cheerio = require("cheerio");

const getMovies = async () => {
  var options = {
    method: "POST",
    url: `https://web-api.poco.cn/v1_1/rank/get_homepage_recommend_list`,
    form: {
      req: {
        version: "1.1.0",
        app_name: "poco_photography_web",
        os_type: "weixin",
        is_enc: 0,
        env: "prod",
        ctime: 1608621683997,
        param: {
          start: 0,
          length: 20,
          works_category: "6",
          time_point: 1608621684,
        },
        sign_code: "6ed4aa723fbea028440",
      },
      host_port: "https://photo.poco.cn",
    },
    json: true, // Automatically stringifies the body to JSON
  };

  let $ = await rp(options);
  console.log($);
};

//开始爬取页面数据
getMovies();
