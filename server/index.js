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

// Middleware connection
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST - PDF generation and data fetch for a commercial proposal
app.post("/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), {}).toFile("offer.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
    }

    res.send(Promise.resolve());
  });
});

// POST - PDF generation and data fetch for a technical description
app.post("/merge-img", (req, res) => {
  var directory = `${__dirname}/descriptions/`;

  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory);

  var pageLens = req.body.pageNumbers;
  var imagesPath = [];

  for (const pageLen of pageLens) {
    var currentPair = pageLen.split("-");
    var pageStart = parseInt(currentPair[0]);
    var pageEnd = parseInt(currentPair[1]);

    for (let i = pageStart; i <= pageEnd; i++) {
      var imagePath = `public/images/${i}.jpg`;
      imagesPath.push(imagePath);
    }
  }

  imagesToPdf(imagesPath, `${__dirname}/descriptions/description.pdf`);

  res.send(Promise.resolve());
});

// GET - Get PDF offer data
app.get("/offer-pdf", (req, res) => {
  res.sendFile(`${__dirname}/offer.pdf`);
});

// GET - Get PDF description data
app.get("/description-pdf", (req, res) => {
  res.sendFile(`${__dirname}/descriptions/description.pdf`);
});

app.get("/get-db-data", (req, res) => {
  var wb = xlsx.readFile("./database.xlsx");
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data = xlsx.utils.sheet_to_json(ws);

  res.send(data);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
