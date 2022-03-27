module.exports = ({ clientName, companyName, items, paymentTerms, deliveryTime }) => {

var petrovich = require('petrovich');

const d = new Date();

/**
 * Разделяем ФИО по частям
 */
var personData = clientName.split(' ');
var person = {
   first: personData[1],
   middle: personData[2],
   last: personData[0]
  };

/**
 * Подсчет общей цены товаров
 */
var total = 0;
for (const item of items) {
	var price = item.Price.toString().replace('-', '.').replace(/\s/g, '');
   total += parseFloat(price) * parseInt(item.Amount);
}

/**
 * Делаем разрыв страницы после условий оплаты, если в таблице более 6 позиций
 */
var newPageClass = ""
var newPageTopPadding = 0
if(items.length > 6) {
  newPageClass = "clear newpage";
  newPageTopPadding = 50;
}

return `
<!doctype html>
<html>
  <head>
    <tbody>
      <meta charset="utf-8">
      <title>PDF Result Template</title>
      <style>
        .invoice-box {
          max-width: 800px;
          margin: auto;
          margin-top: -25px;
          padding: 30px;
          font-size: 16px;
          line-height: 24px;
          font-family: 'Helvetica Neue', 'Helvetica',
            color: #555;
            position: relative;
            min-height: 325vh;
        }

        .justify-center {
          text-align: center;
        }

        .invoice-box table {
          width: 100%;
          line-height: inherit;
          text-align: left;
        }

        .invoice-box table td {
          padding: 5px;
          vertical-align: top;
        }

        .invoice-box table tr td:nth-child(2) {
          text-align: right;
        }

        .invoice-box table tr.top table td {
          padding-bottom: 20px;
        }

        .invoice-box table tr.top table td.title {
          font-size: 45px;
          line-height: 45px;
          color: #333;
        }

        .invoice-box table tr.information table td {
          padding-bottom: 40px;
        }

        .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }

        .invoice-box table tr.details td {
          padding-bottom: 20px;
        }

        .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.item.last td {
          border-bottom: none;
        }

        .invoice-box table tr.total td:nth-child(2) {
          border-top: 2px solid #eee;
          font-weight: bold;
        }

        @media only screen and (max-width: 600px) {
          .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
          }

          .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
          }
        }

        h2 {
          color: black;
          font-family: "Verdana Pro Cond Semibold", sans-serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: none;
          font-size: 14pt;
        }

        .s1 {
          color: black;
          font-family: "Bahnschrift SemiCondensed", sans-serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: none;
          font-size: 48pt;
        }

        .h1 {
          color: black;
          font-family: "Verdana Pro Cond Semibold", sans-serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: none;
          font-size: 48pt;
        }

        .s2 {
          color: black;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: none;
          font-size: 12pt;
        }

        .s3 {
          color: black;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: normal;
          text-decoration: none;
          font-size: 12pt;
        }

        p {
          color: black;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: normal;
          text-decoration: none;
          font-size: 12pt;
          margin: 0pt;
        }

        .s4 {
          color: black;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: none;
          font-size: 11pt;
        }

        .s5 {
          color: black;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: normal;
          text-decoration: none;
          font-size: 11pt;
        }

        h4 {
          color: black;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: none;
          font-size: 10.5pt;
          line-height: 0.7;
        }

        .a {
          color: #00F;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: underline;
          font-size: 10.5pt;
        }

        .s6 {
          color: #00F;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: none;
          font-size: 10.5pt;
        }

        .s7 {
          color: #00F;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: bold;
          text-decoration: underline;
          font-size: 12pt;
        }

        li {
          display: block;
        }

        #l1 {
          padding-left: 0pt;
          counter-reset: c1 1;
        }

        #l1>li>*:first-child:before {
          counter-increment: c1;
          content: counter(c1, decimal)". ";
          color: black;
          font-family: "Times New Roman", serif;
          font-style: normal;
          font-weight: normal;
          text-decoration: none;
          font-size: 12pt;
        }

        #l1>li:first-child>*:first-child:before {
          counter-increment: c1 0;
        }

        table.orderTable {
          border: 1px solid #000000;
          background-color: #FFFFFF;
          width: 100%;
          text-align: center;
          border-collapse: collapse;
          page-break-inside:auto
        }

        table.orderTable td,
        table.orderTable th {
          border: 1px solid #000000;
          padding: 0px 0px;
        }

        table.orderTable tbody td {
          font-size: 15px;
        }

        table.orderTable tr:nth-child(even) {
          background: #FFFFFF;
        }

        table.orderTable thead {
          background: #DDDDDD;
          border-bottom: 1px solid #444444;
        }

        table.orderTable thead th {
          font-size: 16px;
          font-weight: bold;
          color: #000000;
          text-align: center;
          border-left: 1px solid #000000;
        }

        table.orderTable thead th:first-child {
          border-left: none;
        }

        table.orderTable tfoot {
          font-size: 14px;
          font-weight: normal;
          color: #000000;
          position: relative;
          border-top: 1px solid #000000;
          left: 20%;
        }

        .signature {
         display: block;
         margin-left: auto;
         margin-right: 100px;
         margin-top: -55px;
       }

       .footer {
          position: absolute;
          bottom: 0;
          height: 2.5rem;   
          width:220pt;
       }

       .newpage {
         page-break-before: always;
       }

       #link {
         color: blue;
       }

      </style>
  </head>
  <body>
    <div class="invoice-box">
      <table>
        <tr class="top">
          <h2 style="line-height: 14pt;text-align: center;">ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ</h2>
          <p class="s1" style="line-height: 55pt;text-align: center;">«<span class="h1">РТК </span>«<span class="h1">РОСАКВА</span>»</p>
        </tr>
        <table style="border-collapse:collapse;margin-left:8.7pt" cellspacing="0">
          <tr style="height:17pt">
            <td style="width:296pt;border-top-style:solid;border-top-width:2pt">
              <p class="s2" style="padding-left: 14pt;line-height: 13pt;text-align: left;">Исх.
              ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} №РА-${d.getFullYear().toString().substr(-2)}/508</p>
            </td>
            <td style="width:220pt;border-top-style:solid;border-top-width:2pt">
              <p class="s3" style="padding-left: 136pt;line-height: 13pt;text-align: left;">${companyName}</p>
            </td>
          </tr>
        </table>
        <tr>
          <td>
            <p style="padding-right: 3pt;text-align: right;"> ${petrovich(person, 'dative').last} ${petrovich(person, 'dative').first.charAt(0)}. ${petrovich(person, 'dative').middle.charAt(0)}. </p>
          </td>
        </tr>
        <p style="padding-top: 12pt;padding-left: 20pt;text-indent: 35pt;text-align: justify;">ООО «РТК «РосАква» является официальным эксклюзивным представителем в России и странах СНГ компании <b>Changsha Kaiyuan Instruments Co.,Ltd </b>– ведущего производителя КНР и разработчика высококлассного аналитического оборудования, автоматизированных систем пробоотбора и пробоподготовки, систем 100% контроля качества твердого топлива.</p>
        <p style="padding-left: 58pt;text-align: justify;">Предлагаем Вам рассмотреть возможность поставки для нужд Вашего предприятия</p><br/>

          <table class="orderTable">
            <thead>
              <tr>
                <th scope="col">№</th>
                <th scope="col">Наименование продукции</th>
                <th scope="col">Модель</th>
                <th scope="col">Кол-во</th>
                <th scope="col">Стоимость, руб. Без НДС</th>
              </tr>
            </thead>
            <tbody>
               ${items.map((d) => (
                  `<tr key=${d.Id}>
                    <td>${d.Id}</td>
                     <td style="text-align: center;">${d.ProductName}</td>
                     <td><b>${d.Model}<b /></td>
                     <td>${d.Amount}</td>
                  <td>${d.Price}</td>
               </tr>`
               )).join("")}
            </tbody>
            <tfoot>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td><b>ИТОГО<b /></td>
                <td>${total.toLocaleString().replace(',', '-')}</td>
              </tr>
            </tfoot>
          </table>
      </table>

      <p style="text-align: left;"><br /></p>
      <p style="padding-left: 23pt;text-indent: 35pt;text-align: justify;">Цены указаны с учетом доставки до места установки, в стоимость включены пусконаладочные работы.</p>
      <p style="text-align: left;"><br /></p>

      <p class="${newPageClass}" style="padding-left: 58pt;text-align: left; padding-top: ${newPageTopPadding}px">Условия оплаты:</p>
      
      <p style="padding-left: 88pt;text-indent: -11pt;text-align: left;">${paymentTerms.replace(/\r?\n/g, '<br />')}</p><br />

      <p style="padding-left: 58pt;text-align: left;">Срок поставки: ${deliveryTime} с момента подписания договора.</p>
      <p style="padding-left: 58pt;text-align: left;">Приложение: техническое описание приборов.</p>
      <p style="text-align: left;"><br /></p>
      <p style="text-align: left;">
      <p style="padding-left: 58pt;text-align: left;">С уважением,</p>
      <p style="padding-left: 58pt;text-align: left;">Генеральный директор Зенкин А.В.</p>
      
      <img class="signature"; src="data:image/jpg;base64,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"/>

      <div class="footer" style="width: 730px;">
        <p style="padding-top: 25pt;" />
        <p style="border-top-style:solid;border-top-width:2pt"></p>
        <p style="padding-left: 5pt;padding-top: 10pt;"><b>199106, Россия,</b></p>
        <p style="padding-left: 5pt;"><b>г. Санкт-Петербург,</b></p>
        <p style="padding-left: 5pt;"><b>Мебельная 5А, офис 317</b></p>
      </div>

      <div class="footer" style="width: 730px; text-align: right">
        <p style="padding-top: 25pt;" />
        <p style="padding-left: 5pt;padding-top: 10pt;"><b>тел/факс: (812) 600-36-12</b></p>
        <p style="padding-left: 5pt;"><b>e-mail: <u id="link" href="https://outlook.office.com/mail/deeplink/compose?mailtouri=mailto%3Ainfo%40rosaqua.ru">info@rosaqua.ru</u></b></p>
        <p style="padding-left: 5pt;"><b>сайт: <u id="link" href="http://www.rosaqua.ru">www.rosaqua.ru</u></b></p>
    </div>

    </div>
  </body>
</html>`;
};