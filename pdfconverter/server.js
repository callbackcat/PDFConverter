const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const cors = require("cors");
const pdfTemplate = require("./documents");
const imagesToPdf = require("images-to-pdf");
const fs = require("fs");
const xlsx = require("xlsx");

const app = express();

const port = process.env.PORT || 5000;

// Подключение промежуточного программного обеспечения
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

// POST - PDF генерация для коммерческого предложения
app.post("/api/create-pdf", (req, res) => {
  pdf
    .create(pdfTemplate(req.body), {})
    .toFile(`${__dirname}/output/offer.pdf`, (err) => {
      if (err) {
        res.send(Promise.reject());
      }

      res.send(Promise.resolve());
    });
});

// POST - PDF генерация для технического описания
app.post("/api/merge-img", (req, res) => {
  var pageLens = req.body.pageNumbers;

  var imagesPath = [];
  var numericArr = [];

  pageLens.forEach((element) => {
    var currentPair = element.split("-");
    if (currentPair.length > 1) {
      numericArr.push(currentPair[0]);
      numericArr.push(currentPair[1]);
    } else {
      numericArr.push(currentPair[0]);
    }
  });

  if (!numericArr.some(isNaN)) {
    for (const pageLen of pageLens) {
      var currentPair = pageLen.split("-");

      if (currentPair.length === 1) {
        var imagePath = `public/images/${currentPair}.jpg`;
        imagesPath.push(imagePath);
        continue;
      }

      var pageStart = parseInt(currentPair[0]);
      var pageEnd = parseInt(currentPair[1]);

      for (let i = pageStart; i <= pageEnd; i++) {
        var imagePath = `public/images/${i}.jpg`;
        imagesPath.push(imagePath);
      }
    }

    imagesToPdf(imagesPath, `${__dirname}/output/description.pdf`);

    res.send(Promise.resolve());
  }
});

// GET - Получаем PDF оффер
app.get("/api/offer-pdf", (req, res) => {
  res.sendFile(`${__dirname}/output/offer.pdf`);
});

// GET - Получаем PDF описание
app.get("/api/description-pdf", (req, res) => {
  res.sendFile(`${__dirname}/output/description.pdf`);
});

// GET - Получаем данные из таблицы БД
app.get("/api/get-db-data", (req, res) => {
  var wb = xlsx.readFile("./database.xlsx");
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data = xlsx.utils.sheet_to_json(ws);

  res.send(data);
});

// GET - Получаем условия из таблицы БД
app.get("/api/get-db-terms", (req, res) => {
  var wb = xlsx.readFile("./database.xlsx");
  const wsname = wb.SheetNames[1];
  const ws = wb.Sheets[wsname];
  const data = xlsx.utils.sheet_to_json(ws);

  res.send(data);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
