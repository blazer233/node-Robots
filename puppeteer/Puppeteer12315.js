const puppeteer = require("puppeteer");
const month = "八月";
const day = "30";
(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 150 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setJavaScriptEnabled(true);
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto("https://kyfw.12306.cn/otn/login/init");
  await page.type("#username", "yourtele");
  await page.type("#password", "yourkey");
  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
  console.log(page.url());
  console.log("填写验证码后登录");
  await page.waitForNavigation({
    waitUntil: "load",
  });
  await page.waitForSelector("#selectYuding,#my12306page");
  await page.goto("https://kyfw.12306.cn/otn/leftTicket/init");

  await page.evaluate(() => {
    document.querySelector("#fromStation").value = "SHH";
    document.querySelector("#toStation").value = "TJP";
  });
  // const fromStationText = await page.$("#fromStationText");
  // await fromStationText.click();
  // await page.keyboard.type("BJP");
  // const toStationText = await page.$("#toStationText");
  // await toStationText.click();
  // await page.keyboard.type("SHH");
  await page.tap("#date_icon_1");
  //填写表单
  console.log("开始填写日期");
  await page.evaluate(
    (month, day) => {
      let cals = document.querySelectorAll(".cal");
      let target = Array.from(cals).filter(
        cal => cal.querySelector(".month input").value === month
      )[0];
      let days = target.querySelectorAll(".cal-cm .cell");
      let theDay = Array.from(days).filter(
        dayel => dayel.innerText === day + "\n"
      )[0];
      theDay.click();
    },
    month,
    day
  );
  //点击查询
  await page.tap("#query_ticket");
  console.log("开始查询");
  await page.waitForSelector("tr[datatran]");
  let tra = await page.$('[datatran="G216"]');
  await page.evaluate(() => {
    var trainId = document.querySelector('[datatran="G216"]').id;
    console.log(this.trainId);
    let tr = document.querySelector("#" + trainId.replace("price", "ticket"));
    let yuding_btns = tr.querySelector("td:last-child a"); //看有没有预定的btn
    yuding_btns.click();
  });
  page.on("load", async () => {
    await page.tap("#normalPassenger_0");
    await page.tap("#submitOrder_id");
    await page.tap("#qr_submit_id");
  });

  await browser.close();
})();
