const { createCanvas, loadImage } = require("canvas");

exports.processImage = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext("2d");
      const image = await loadImage(`uploads/resized/${file}`);
      ctx.drawImage(image, 0, 0, 512, 512);
      const frame = await loadImage(`frames/frames02.png`);
      ctx.drawImage(frame, 0, 0, 512, 512);

      const imageData = canvas.toDataURL();

      resolve(imageData);
    } catch (error) {
      console.log("ERROR : ", error);
      reject(error);
    }
  });
};
