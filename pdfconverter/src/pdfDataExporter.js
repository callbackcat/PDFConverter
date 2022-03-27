import React, { Component } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";

export class PDF extends Component {

  /**
   * Состояние документа, которое прокидывается в documents/index.js
   */
  state = {
    clientName: '',
    companyName: '',
    prepayment: 0,
    uponShipment: 0,
    afterWork: 0,
    items: []
  }

  readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      this.setState({items: d});
    });
  };

  /**
   * 
   * @param {number} value Значение, которое вписывается в поле для ввода
   * @param {string} name Название соответствующего поля 
   * @returns {void} Устанавливает значение name равным value в состоянии state 
   */
  handleChange = ({ target: { value, name }}) => this.setState({ [name]: value })

  /**
   * Посылаем запрос на создание документа на сервер
   */
  createAndDownloadPdf = () => {
    axios.post('/create-pdf', this.state)
    .then(() => axios.get('offer-pdf', { responseType: 'blob' }))
    .then((res) => { 
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, 'offer.pdf');
      })
  }

  render() {
    return (
      <div className="PDF">
        <input type="text" placeholder="ФИО получателя" name="clientName" onChange={this.handleChange} />
        <input type="text" placeholder="Название компании" name="companyName" onChange={this.handleChange} />

        <input type="number" placeholder="Предоплата, %" name="prepayment" onChange={this.handleChange} />
        <input type="number" placeholder="По факту отгрузки, %" name="uponShipment" onChange={this.handleChange} />
        <input style={{width: "230px"}} type="number" placeholder="После проведения работ, %" name="afterWork" onChange={this.handleChange} />

        <button disabled={!(this.state.clientName && this.state.companyName)} onClick={this.createAndDownloadPdf}><b>Скачать PDF</b></button>
        <input type="file" onChange={(e) => { const file = e.target.files[0]; this.readExcel(file); }} />

        <br/><br/><p><b>Инструкция:</b></p>
        <p>1. Введите ФИО получателя в именительном падеже (<b>Пример:</b> Иванов Иван Иванович)</p>
        <p>2. Заполните графу с принимающей компанией (<b>Пример:</b> ООО «АРОСА»)</p>
        <p>3. Введите процент предоплаты, по факту отгрузки и после выполнения работ</p>
        <p>4. Загрузите данные с поставкой из Excel (<b>Кнопка «Выберите файл»</b>)</p>
        <p>5. Если вас устраивают данные в таблице, то нажмите кнопку <b>«Скачать PDF»</b></p>
        <p>В противном случае используйте блок <b>"Действия"</b> для редактирования информации в таблице</p><br/>

        <table class="table container">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Наименование продукции</th>
            <th scope="col">Модель</th>
            <th scope="col">Кол-во</th>
            <th scope="col">Стоимость, руб. Без НДС</th>
            <th scope="col">Действия</th>
          </tr>
        </thead>
        <tbody>
          {this.state.items.map((d) => (
            <tr key={d.Item}>
              <th>{d.Item}</th>
              <td>{d.ProductName}</td>
              <td>{d.Model}</td>
              <td>{d.Amount}</td>
              <td>{d.Price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  }
}