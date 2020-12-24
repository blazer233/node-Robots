const walker = require("puppeteer-walker")();

walker.on("end", () => console.log("finished walking"));
walker.on("error", err => console.log("error", err));
walker.on("page", async page => {
  var title = await page.content();
  console.log(title);
});

walker.walk("https://www.baidu.com/");
