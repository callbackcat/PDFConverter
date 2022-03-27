const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const cors = require('cors');
const pdfTemplate = require('./documents');

const app = express();
const port = process.env.PORT || 5000;

// Middleware connection
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// POST - PDF generation and data fetch
app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('offer.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        
        res.send(Promise.resolve());
    });
});

// GET - Get PDF data
app.get('/offer-pdf', (req, res) => {
    res.sendFile(`${__dirname}/offer.pdf`)
})

app.listen(port, () => console.log(`Listening on port ${port}`));