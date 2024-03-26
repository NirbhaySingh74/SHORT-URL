const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const app = express();
const PORT = 8001;
connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("mongoDb Connected")
);

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortID", async (req, res) => {
  const shortID = req.params.shortID;

  const entry = await URL.findOneAndUpdate(
    { shortID },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (!entry || !entry.redirectURL) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log("server started at PORT :", PORT));
