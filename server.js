const rp = require("request-promise");
sconst config = require("./config");
const fs = require("fs");
const path = require("path");
const page = 1;
const errors = [];
const success = [];
const obj = url => ({
  url,
  headers: {
    "User-Agent": config.randomHead(),
    "X-Forwarded-For": config.returnIp(),
  },
});
const read = async page => {
  const time = +new Date();
  const url = `http://video.mtime.com/api/videoSearch/getFilterData?h=movie&y=%E5%85%A8%E9%83%A8%E5%B9%B4%E4%BB%A3&p=1&s=2&i=${page}&c=30`;
  const { movieIntegrateList } = JSON.parse(await rp(obj(url)));
  movieIntegrateList.map(({ coverPath: src, titleCn: na }) => {
    const name = na + ".jpg";
    const out = fs.createWriteStream(path.resolve(__dirname + "/imgs", name));
    rp(obj(`http:${src}`)).pipe(out);
    out.on("error", err => {
      errors.push(err);
      console.log(`丢失${errors.length}张图片 原因${err}`);
    });
    out.on("finsh", () => {
      success.push(name);
      console.log(`下载成功--------------：${name}`);
    });
    out.on("ok", () => {
      success.push(name);
      console.log(`下载成功--------------：${name}`);
    });
  });
  if (page < 30) {
    console.log(`爬取----${page}----页 用时--${+new Date() - time} `);
    read(page + 1);
  } else {
    // var writerStream = fs.createWriteStream("output.json");
    // writerStream.write(JSON.stringify(p));
    // writerStream.end();
    // writerStream.on("finish", function () {
    //   console.log("写入完成。");
    // });
    console.log("成功，共下载" + success.length + "张");
  }
};
read(page);
