const phantom = require("phantom");
const cheerio = require("cheerio");
const screenshot = async (url, url_) => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  const page2 = await instance.createPage();
  // await page.property("viewportSize", { width: 1024, height: 600 });
  const status = await page.open(url);
  const status2 = await page2.open(url_);
  console.log(`Page opened with status [${status}、${status2}].`);
  const content = await page.property("content");
  const content2 = await page2.property("content");

  const $ = cheerio.load(content);
  const $_ = cheerio.load(content2);
  console.log($("#su").attr("value"), $_("#SIvCob").text());
  // const base64 = await page.renderBase64("PNG");
  // console.log(base64);
  // await page.render(url + ".jpeg", { format: "jpeg", quality: "100" });
  // console.log(`File created at [${url}.jpeg]`);
  // await page.render(url + ".pdf");
  // console.log(`File created at [url.pdf]`);

  await instance.exit();
};
screenshot(
  "https://www.baidu.com/",
  "https://www.google.com.hk/webhp?hl=zh-CN&sourceid=cnhp&gws_rd=ssl"
);
