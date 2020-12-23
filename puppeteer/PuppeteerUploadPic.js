const puppeteer = require("puppeteer");
//puppeteer文件上传操作，适用原声控件：<input type=file/>
async function upload() {
  //创建一个Browser浏览器实例，并设置相关参数
  const browser = await puppeteer.launch({
    headless: false,
  });
  //创建一个Page实例
  const page = await browser.newPage();
  //跳转百度首页
  await page.goto("https://graph.baidu.com/pcpage/index?tpl_from=pc");
  //等待元素加载成功
  const soutuBtn = await page.waitForSelector(
    ".graph-search-right > div > form > input"
  );
  //点击上传图片按钮
  await soutuBtn.click();
  //上传图片目录自定义
  await uploadPic.uploadFile(
    `F:\\code_git\\node-Robots\\puppeteer\\window.jpg`
  );
  //关闭浏览器
  await browser.close();
}
upload();
