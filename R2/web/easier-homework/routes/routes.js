const { isAdmin, authSecret } = require("../utils/authorisation");
const express = require("express");
const router = express.Router({ caseSensitive: true });
const visit = require("../utils/bot.js");
const FLAG = process.env.FLAG;
var Recaptcha = require("express-recaptcha").RecaptchaV3;
var recaptcha = new Recaptcha(
  "6LdBZ38hAAAAABuFCH0e6DQouw5kUEfV0-XgJSlD",
  "6LdBZ38hAAAAAAe3qy1yRC5oCteJbxsjDFnziJMn"
);

router.get("/", (req, res) => {
  if (req.query.note) {
    var note_sanitized = req.query.note.replace("script", "");
    return res.render("index.html", { note: note_sanitized });
  }
  return res.render("index.html", { note: "" });
});

router.get("/report", (req, res) => {
  return res.render("report.html");
});

router.post("/report", recaptcha.middleware.verify, async (req, res) => {
  try {

    await visit(`http://127.0.0.1/?note=${req.body.note}`, authSecret);

  } catch (e) {
    console.log(e);
    return res.render("report.html", { message: "Something went wrong!" });
  }
  return res.render("report.html", {
    message: "Багш даалгаврыг шалгалаа",
  });
});

router.get("/flag", async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(401).send({
        error: "Хандах эрхгүй байна.",
      });
    res.set(
      "Cache-Control",
      "private, max-age=0, s-maxage=0 ,no-cache, no-store"
    );
    return res.status(200).send({
      Flag: FLAG,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong!",
    });
  }
});

module.exports = () => {
  return router;
};
