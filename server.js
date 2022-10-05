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

// app.use("/", express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const { filename: image } = req.file;
    let width, height;
    const type = req.body.type;
    if (type === "story") {
      width = 700;
      height = 1200;
    } else {
      width = 500;
      height = 500;
    }
    const response = await sharp(req.file.path)
      .resize(width, height)
      .jpeg({ quality: 90 })
      .toFile(path.resolve(req.file.destination, "resized", image));
    fs.unlinkSync(req.file.path);

    const outputImage = await processImage(image, type, width, height);
    res.send({
      image: outputImage,
    });
    // res.render("output", { image: outputImage });
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/output", async function (req, res) {
  const image = await processImage("photo-1663692890131.png");
  res.render("output", { image });
});

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
