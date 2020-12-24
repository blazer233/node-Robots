const puppeteer = require("puppeteer");
const { sleep } = require("../config");
const down = async () => {
  const browser = await puppeteer.launch({});
  console.log(`----解析网页---`);
  let page = await browser.newPage();
  await page.goto("http://es6.ruanyifeng.com/#README");
  let Tags = await page.evaluate(() =>
    [...document.querySelectorAll("ol li a")].map(({ href, innerText }) => ({
      href,
      innerText,
    }))
  );
  console.log("----开始爬取----:");
  Tags.forEach(async ({ innerText, href }, index) => {
    start = +new Date();
    let _page = await browser.newPage();
    console.log(
      "----正在下载----:" +
        (index + 1) +
        "_" +
        innerText +
        "用时:" +
        (+new Date() - start)
    );
    await _page.goto(href);
    await sleep(1000);
    await _page.pdf({
      // // 生成pdf时的页边距
      // margin: {
      //   top: "60px",
      //   right: "0px",
      //   bottom: "60px",
      //   left: "0px",
      // },
      // // 生成pdf时是否显示页眉页脚
      displayHeaderFooter: true,
      // // 生成pdf页面格式
      format: "A4",
      path: `./es6-pdf/${index + 1}_${innerText}.pdf`,
    });
    await _page.close();
  });
  await page.on("console", () => console.log("----下载完成----"));
  console.log("----下载完成()----:");
  await page.close();
};

down();
