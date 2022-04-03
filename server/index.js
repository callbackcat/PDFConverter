const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const cors = require('cors');
const pdfTemplate = require('./documents');
const imagesToPdf = require("images-to-pdf")
const fs = require('fs');
const archiver = require('archiver');

const app = express();

const port = process.env.PORT || 5000;

// Middleware connection
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// POST - PDF generation and data fetch for a commercial proposal
app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('offer.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        
        res.send(Promise.resolve());
    });
});

// POST - PDF generation and data fetch for a technical description
app.post('/merge-img', (req, res) => {

  var directory = `${__dirname}/descriptions/`;

  // Удаляем папку и ее содержимое с нарезаными pdf-ками, чтобы сформировать новые описания
  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory);

  var pageLens = req.body.pageNumbers;
  var imagesPath = [];

  for(const pageLen of pageLens) {
    var currentPair = pageLen.split('-');
    var pageStart = parseInt(currentPair[0]);
    var pageEnd = parseInt(currentPair[1]);

    for(let i = pageStart; i <= pageEnd; i++) {
      var imagePath = `public/images/${i}.jpg`;
      imagesPath.push(imagePath);
    }

    imagesToPdf(imagesPath, `${__dirname}/descriptions/description-${pageStart}-${pageEnd}.pdf`)
    imagesPath = [];
  }

  res.send(Promise.resolve());
});

// GET - Get PDF offer data
app.get('/offer-pdf', (req, res) => {
  res.sendFile(`${__dirname}/offer.pdf`)
})

// GET - Get PDF description data 
app.get('/description-zip', (req, res) => {
  var stream = fs.createWriteStream(`${__dirname}/description.zip`);
  const archive = archiver('zip');
  archive.pipe(stream);
  archive.directory(`${__dirname}/descriptions/`, false);

  stream.on('close', () => console.log("Write stream was closed"));
  archive.finalize();

  // Задержка в 6 секунд, чтобы архив успел сформироваться
  setInterval(function() {
    res.sendFile(`${__dirname}/description.zip`);
  }, 6000);
})

app.listen(port, () => console.log(`Listening on port ${port}`));