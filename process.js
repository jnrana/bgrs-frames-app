const { createCanvas, loadImage } = require("canvas");

exports.processImage = (file, type, width, height) => {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      const image = await loadImage(`uploads/resized/${file}`);
      ctx.drawImage(image, 0, 0, width, height);
      let frame;
      if (type === "story") {
        frame = await loadImage(`frames/frame-story.png`);
      } else {
        frame = await loadImage(`frames/frames-round.png`);
      }
      ctx.drawImage(frame, 0, 0, width, height);
      const imageData = canvas.toDataURL();

      resolve(imageData);
    } catch (error) {
      console.log("ERROR : ", error);
      reject(error);
    }
  });
};
