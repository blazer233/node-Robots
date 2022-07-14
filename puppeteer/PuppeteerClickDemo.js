const puppeteer = require("puppeteer");
const screenshot = "github.png";
const config = require("../config");
const events = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 150,
    args: [`--proxy-server=${config.returnIp()}`],
    ignoreHTTPSErrors: true,
  }); //headless：浏览器出现 slowMo：速度降低
  const page = await browser.newPage();
  await page.setUserAgent(config.randomHead());
  await page.goto("https://github.com/login");
  await page.waitForSelector("#login_field", { visible: true }); //等待id为login_field的元素出现继续执行
  await page.focus("#login_field"); //输入聚焦在某处
  await page.keyboard.type("搜索", { delay: 100 }); //键盘输入与 focus 连用
  await page.type("#login_field", "839752074@qq.com", { delay: 20 }); //向某个 Input 中输入字符
  await page.keyboard.down("Tab"); //敲击Tab键
  await page.frames().map(frame => frame.url());
  //找出页面所有的frames
  await page.type("#password", "123321", { delay: 20 }); //向某个 Input 中输入字符
  await page.click('[name="commit"]'); //点击某个节点
  await page.keyboard.press("Enter");
  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
  console.log(page.url());
  console.log("填写验证码后登录");
  await page.waitForNavigation({
    waitUntil: "load",
  });
  await page.evaluate(() => alert("1")); //在浏览器中执行一段 JavaScript 代码
  await page.screenshot({ path: screenshot });
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  const searchValue = await page.$eval("#search", el => el.value); //获得id为search元素的value值
  const text = await page.$eval(".text", el => el.textContent); //获得class为text元素的文本
  const html = await page.$eval(".main-container", e => e.outerHTML); //获得class为main-container元素的html
  const div = await page.$$eval("div", e => e.length); //获得标签为div元素的所有元素

  browser.close();
  console.log("See screenshot: " + screenshot);
};
events();
