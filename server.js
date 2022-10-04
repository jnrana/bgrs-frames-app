const express = require("express");
const engine = require("ejs-blocks");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const app = express();
const { processImage } = require("./process");

app.set("views", __dirname + "/views");
app.engine("ejs", engine);
app.set("view engine", "ejs");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });

const PORT = 3000;

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/upload", upload.single("photo"), async (req, res) => {
  const { filename: image } = req.file;

  const response = await sharp(req.file.path)
    .resize(512, 512)
    .jpeg({ quality: 90 })
    .toFile(path.resolve(req.file.destination, "resized", image));
  fs.unlinkSync(req.file.path);

  const outputImage = await processImage(image);
  res.render("output", { image: outputImage });
});

app.get("/output", async function (req, res) {
  const image = await processImage("photo-1663692890131.png");
  res.render("output", { image });
});

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
