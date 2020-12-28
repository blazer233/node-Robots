const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 开始收集JS和CSS文件的覆盖率信息
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ]);

  await page.goto("https://www.baidu.com");
  await page.waitForSelector("title");

  // 停止收集覆盖率信息
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  // 根据覆盖率计算使用了多少字节
  const calculateUsedBytes = (type, coverage) =>
    coverage.map(({ url, ranges, text }) => {
      let usedBytes = 0;
      ranges.forEach(range => (usedBytes += range.end - range.start - 1));
      return {
        url,
        type,
        usedBytes,
        totalBytes: text.length,
      };
    });

  console.info([
    ...calculateUsedBytes("js", jsCoverage),
    ...calculateUsedBytes("css", cssCoverage),
  ]);

  await browser.close();
})();
