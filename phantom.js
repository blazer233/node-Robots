const phantom = require("phantom");
const cheerio = require("cheerio");
const config = require("./config");
const photo = [];
const phantom_ = async () => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  //   await page.on("onResourceRequested", function (requestData) {
  //     console.info("Requesting", requestData.url);
  //   });

  page.property("customHeaders", {
    "X-Forwarded-For": config.returnIp(),
    "User-Agent": config.randomHead(),
  });
  const status = await page.open("http://localhost:5678/");
  console.info("当前状态：" + status);
  const content = await page.property("content");
  console.log(content);
  //   const $ = cheerio.load(content);
  //   $(".images-gallery > a").each((index, el) => {
  //     const name = "https:" + $(el).find("img").attr("src");
  //     const fee = $(el).find(".image-title").text();
  //     console.log({ name, fee });
  //     photo.push({ name, fee });
  //   });
  await instance.exit();
  console.log(photo.length);
};
phantom_();
