const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ytdl = require("ytdl-core");
const { ErrorProvider } = require("./providers/ErrorProvider");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/getVideo", async (req, res) => {
  const { URL } = req.query;
  res.header("Content-Type", "application/json");

  try {
    let validateURL = ytdl.validateURL(URL);
    if (!validateURL) {
      throw new Error("URL is not valid or doesn't exists");
    }

    let videoID = ytdl.getURLVideoID(URL);
    let info = await ytdl.getInfo(videoID);

    res.status(200).json(info);
  } catch (err) {
    ErrorProvider(res, 404, err.message);
  }
});

app.get("/download", (req, res) => {
  const { URL, title, type } = req.query;
  res.header(
    "Content-Disposition",
    `attachment; filename=${title}.${type === "video" ? "mp4" : "mp3"}`
  );

  ytdl(URL, { quality: type === "video" ? "highest" : "highestaudio" }).pipe(
    res
  );
});

app.listen(PORT, () => {
  console.log("PORT: " + PORT);
});
