const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");
var fs = require("fs");
const {
  ServiceBuilder,
  getDefaultService,
  Options,
  setDefaultService,
} = require("selenium-webdriver/chrome");
const example = async () => {
  const options = new Options();
  const mes = [];
  options.addArguments("--start-maximized"); // 启动就最大化，而不是像后面再使用 maximize() 那样之后再最大化
  options.addArguments("--disable-popup-blocking");
  options.addArguments("no-sandbox");
  options.addArguments("disable-extensions");
  options.excludeSwitches("enable-automation");
  if (getDefaultService() == null) {
    var service;

    // exe 安装之后在根目录找到chromedriver.exe
    if (fs.existsSync(path.join(__dirname, "../../chromedriver.exe"))) {
      console.log(path.join(__dirname, "../../chromedriver.exe"));
      service = new ServiceBuilder(
        path.join(__dirname, "../../chromedriver.exe")
      ).build();
    }

    // 开发过程中寻找 chromedriver
    if (fs.existsSync(path.join(__dirname, "./chromedriver.exe"))) {
      console.log(path.join(__dirname, "./chromedriver.exe"));
      service = new ServiceBuilder(
        path.join(__dirname, "./chromedriver.exe")
      ).build();
    }

    chrome.setDefaultService(service);
  }
  let driver = await new Builder()
    .setChromeOptions(options)
    .withCapabilities(Capabilities.chrome())
    .forBrowser("chrome")
    .build();
  try {
    await driver.get("https://www.lagou.com/");
    // await driver
    //   .findElement(By.css("#changeCityBox .checkTips .tab.focus"))
    //   .click();
    //找到全国站并点击一下
    await driver.findElement(By.id("search_input")).sendKeys("前端", Key.ENTER);
    let items = await driver.findElements(By.className("con_list_item")); //获取模块
    items.forEach(async item => {
      mes.push({
        // 获取岗位名称
        title: await item.findElement(By.css(".p_top h3")).getText(),
        // 获取工作地点
        position: await item.findElement(By.css(".p_top em")).getText(),
        // 获取发布时间
        time: await item.findElement(By.css(".p_top .format-time")).getText(),
        // 获取公司名称
        companyName: await item
          .findElement(By.css(".company .company_name"))
          .getText(),
        // 获取公司所在行业
        industry: await item
          .findElement(By.css(".company .industry"))
          .getText(),
        // 获取薪资待遇
        money: await item.findElement(By.css(".p_bot .money")).getText(),
        // 获取需求背景
        background: await item
          .findElement(By.css(".p_bot .li_b_l"))
          .getText()
          .replace(money, ""),
      });
      console.log(mes);
    });
  } finally {
    await driver.quit();
  }
};

example();
// console.log(Options, options);
