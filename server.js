const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();
const fs = require("fs");
const multer = require("multer");
const { Configuration, OpenAIApi } = require("openai");

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // change the name of the folder you want to upload to
  },
  filename: (req, file, cb) => {
    console.log(file); // this console.log is for debugging purposes
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");
let filePath;

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Image generation function
app.post("/images", async (req, res) => {
  try {
    const numImages = parseInt(req.body.numImages);
    const response = await openai.createImage({
      prompt: req.body.message,
      n: numImages,
      size: "512x512", // size of the image change it to one of these 3 options 256x256, 512x512, 1024x1024
    });
    console.log(response.data.data); // this console.log is for debugging purposes
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Image upload function
app.post("/upload", async (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(500).json({ error: "File upload error" });
    } else if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred" });
    }
    filePath = req.file.path;
    res.status(200).json({ message: "File uploaded successfully" });
  });
});

// Image variation function
app.post("/variations", async (req, res) => {
  try {
    // const numImages = parseInt(req.body.numImages) //! The slider does not work at the moment for the uploaded image variation there is a bugg 
    const response = await openai.createImageVariation(
      fs.createReadStream(filePath),
      //   numImages, //! This variable is not used at the moment for the uploaded image variation there is a bugg
      6,
      "512x512" // size of the image change it to one of these 3 options 256x256, 512x512, 1024x1024
    );
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
