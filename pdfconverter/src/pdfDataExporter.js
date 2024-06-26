import React, { Component, Fragment } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import "bootstrap-icons/font/bootstrap-icons.css";
import { Button } from "react-bootstrap";

import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";
import Dropdown from "./components/Dropdown";
import FAQ from "./components/FAQ";

export class PDF extends Component {
  /**
   * Состояние документа, которое прокидывается в documents/index.js
   */
  state = {
    clientName: "",
    companyName: "",
    paymentTerms: "",
    deliveryTime: "",
    docNum: 0,
    items: [],
    database: [],
    pageNumbers: [],

    editProductId: null,
    editFormData: {
      ProductName: "",
      Model: "",
      Amount: 0,
      Price: "",
      PageNumber: "",
    },

    addFormData: {
      ProductName: "",
      Model: "",
      Amount: 0,
      Price: "",
      PageNumber: "",
    },

    gender: "male",
    showModelDropdown: true,
  };

  /**
   *
   * @param {file} file Файл Excel, который нужно прочитать
   * @returns {void} Устанавливает значение items равным d - JSON Data, в состояниe state
   */
  readExcelСommercialOffer = (file) => {
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

    promise.then((jsonData) => {
      this.setState({ items: jsonData });
      this.recountTechnicalDescriptionPages(jsonData);
    });
  };

  /**
   * Читаем все необходимые данные из базы при первом вызове render()
   * Устанавливаем значения по умолчанию для условий оплаты и доставки из базы
   */
  componentDidMount() {
    this.getDataFromDatabase();
    this.getTermsFromDatabase();
  }

  /**
   * Удаляет ранее выбранный Excel файл, чтобы корректно можно было выбрать другой при необходимости
   */
  handleRepeatFileChange = (event) => {
    event.target.value = "";
  };

  /**
   *
   * @param {number} value Значение, которое вписывается в поле для ввода
   * @param {string} name Название соответствующего поля
   * @returns {void} Устанавливает значение name равным value, в состояниe state
   */
  handleChange = ({ target: { value, name } }) =>
    this.setState({ [name]: value });

  /**
   * Посылаем запрос на создание документа на сервер
   */
  createAndDownloadPdf = () => {
    axios
      .post("api/create-pdf", this.state)
      .then(() => axios.get("api/offer-pdf", { responseType: "blob" }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "offer.pdf");
      });
  };

  /**
   * Посылаем запрос на создание мерджа картинок в техническое описание на сервер
   */
  createAndDownloadPdfFromImg = () => {
    axios
      .post("api/merge-img", this.state)
      .then(() => axios.get("api/description-pdf", { responseType: "blob" }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "description.pdf");
      });
  };

  /**
   * Посылаем запрос на парс данных из "БД" и их установку в стейт
   */
  getDataFromDatabase = () => {
    axios
      .get("api/get-db-data")
      .then((res) => this.setState({ database: res.data }));
  };

  /**
   * Посылаем запрос на парс условий из "БД" и их установку в стейт
   */
  getTermsFromDatabase = () => {
    axios.get("api/get-db-terms").then((res) => {
      this.setState({ paymentTerms: res.data[0].PaymentTerms });
      this.setState({ deliveryTime: res.data[0].DeliveryTerms });
    });
  };

  /**
   *
   * @param {event} event Клик эвент
   * @param {Object} rowData Ряд данных из таблицы
   * Обрабатываем изменения полей в режиме редактирования => записываем во временное состояние
   */
  handleEditClick = (event, rowData) => {
    event.preventDefault();

    this.setState({ editProductId: rowData.Id });

    const formValues = {
      ProductName: rowData.ProductName,
      Model: rowData.Model,
      Amount: rowData.Amount,
      Price: rowData.Price,
      PageNumber: rowData.PageNumber,
    };

    this.setState({ editFormData: formValues });
  };

  /**
   *
   * @param {event} event Клик эвент
   * Заполняем поля промежуточного состояния editFormData для изменения существующего ряда
   */
  handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...this.state.editFormData };
    newFormData[fieldName] = fieldValue;

    this.setState({ editFormData: newFormData });
  };

  /**
   *
   * @param {event} event Клик эвент
   * @param {Object} rowData Ряд данных из таблицы
   * Подгружаем данные из базы по названию Модели и заменяем ряд в таблице
   
  handleLoadModelClick = (event, rowData) => {
    event.preventDefault();

    const dbIndex = this.state.database.findIndex(
      (dbRowData) => dbRowData.Model === rowData.Model
    );

    const index = this.state.items.findIndex(
      (itemsRowData) => itemsRowData.Id === rowData.Id
    );

    const editedDataRow = {
      Id: rowData.Id,
      ProductName: this.state.database[dbIndex].ProductName,
      Model: this.state.database[dbIndex].Model,
      Amount: rowData.Amount,
      Price: this.state.database[dbIndex].Price,
      PageNumber: rowData.PageNumber,
    };

    const newDataRows = [...this.state.items];

    newDataRows[index] = editedDataRow;

    this.setState({ items: newDataRows });
  };
  */

  /**
   *
   * @param {event} event Клик эвент
   * Обновляем таблицу items таблицей newDataRows с измененным рядом
   * Устанавливаем Id изменяемого ряда значением null
   */
  handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedDataRow = {
      Id: this.state.editProductId,
      ProductName: this.state.editFormData.ProductName,
      Model: this.state.editFormData.Model,
      Amount: this.state.editFormData.Amount,
      Price: this.state.editFormData.Price,
      PageNumber: this.state.editFormData.PageNumber,
    };

    const newDataRows = [...this.state.items];
    const index = this.state.items.findIndex(
      (rowData) => rowData.Id === this.state.editProductId
    );

    newDataRows[index] = editedDataRow;

    this.recountTechnicalDescriptionPages(newDataRows);
    this.setState({ items: newDataRows });
    this.setState({ editProductId: null });
  };

  /**
   *
   * @param {event} event Клик эвент
   * Заполняем поля промежуточного состояния addFormData для добавления нового ряда
   */
  handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...this.state.addFormData };
    newFormData[fieldName] = fieldValue;

    this.setState({ addFormData: newFormData });
  };

  /**
   *
   * @param {event} event Клик эвент
   * Подгружаем данные из базы по названию Модели и подставляем в поля добавления нового ряда
   */
  handleModelSelect = (event) => {
    event.preventDefault();

    var currentModel = document.getElementById("modelsList").value;

    const dbIndex = this.state.database.findIndex(
      (dbRowData) => dbRowData.Model === currentModel
    );

    const newDataRow = {
      ProductName: this.state.database[dbIndex].ProductName,
      Model: this.state.database[dbIndex].Model,
      Amount: this.state.addFormData.Amount,
      Price: this.state.database[dbIndex].Price,
      PageNumber: this.state.database[dbIndex].PageNumber,
    };

    this.setState({ addFormData: newDataRow });
  };

  /**
   *
   * @param {event} event Клик эвент
   * Обновляем отображаемый массив JSON-данных items новым updatedDataRows - с добавленным рядом
   */
  handleAddFormSubmit = (event) => {
    event.preventDefault();

    // Если таблица items пустая, то добавляем новый ряд с Id: 1, иначе берем последний Id из таблицы
    var newRowIndex;
    if (this.state.items.length === 0) {
      newRowIndex = 1;
    } else {
      newRowIndex = this.state.items[this.state.items.length - 1].Id + 1;
    }

    const newDataRow = {
      Id: newRowIndex,
      ProductName: this.state.addFormData.ProductName,
      Model: this.state.addFormData.Model,
      Amount: this.state.addFormData.Amount,
      Price: this.state.addFormData.Price,
      PageNumber: this.state.addFormData.PageNumber,
    };

    const updatedDataRows = [...this.state.items, newDataRow];
    this.recountTechnicalDescriptionPages(updatedDataRows);
    this.setState({ items: updatedDataRows });
  };

  /**
   *
   * @param {number} Id Номер ряда, который нужно удалить
   */
  handleDeleteClick = (Id) => {
    const newDataRows = [...this.state.items];

    const index = this.state.items.findIndex((item) => item.Id === Id);

    newDataRows.splice(index, 1);

    // Пересчет Id рядов, после удаления
    for (let i = Id - 1; i < newDataRows.length; i++) {
      newDataRows[i].Id -= 1;
    }

    this.recountTechnicalDescriptionPages(newDataRows);
    this.setState({ items: newDataRows });
  };

  /**
   *
   * @param {array} jsonData Массив текущих данных в таблице
   * Функция пересчитыват количество страниц для ТО в зависимости от изменения таблицы
   */
  recountTechnicalDescriptionPages = (jsonData) => {
    var pages = [];
    for (var jsonItem in jsonData) {
      pages.push(jsonData[jsonItem].PageNumber);
    }

    this.setState({ pageNumbers: pages });
  };

  handleshowModelDropdown = () => {
    this.setState({ showModelDropdown: !this.state.showModelDropdown });
  };

  render() {
    return (
      <div className="PDF">
        <i
          class="bi bi-terminal-fill"
          style={{ position: "absolute", left: 10, top: -10, fontSize: 50 }}
        ></i>
        <input
          style={{ margin: "5px" }}
          type="text"
          placeholder="ФИО получателя"
          name="clientName"
          onChange={this.handleChange}
        />
        <input
          type="radio"
          name="gender"
          value="male"
          onChange={this.handleChange}
          checked={this.state.gender === "male"}
        ></input>
        {"Муж."}
        <input
          style={{ marginLeft: "5px" }}
          type="radio"
          name="gender"
          value="female"
          onChange={this.handleChange}
        ></input>
        {"Жен."}
        <br />
        <input
          style={{ margin: "5px", width: "293px" }}
          type="text"
          placeholder="Название компании"
          name="companyName"
          onChange={this.handleChange}
        />
        <div>
          <textarea
            style={{ margin: "10px" }}
            placeholder="Условия оплаты"
            name="paymentTerms"
            rows="4"
            cols="50"
            value={this.state.paymentTerms}
            onChange={this.handleChange}
          />
        </div>
        <input
          style={{ margin: "5px" }}
          type="text"
          placeholder="Условия поставки"
          name="deliveryTime"
          value={this.state.deliveryTime}
          onChange={this.handleChange}
        />
        <input
          style={{ margin: "5px" }}
          type="number"
          placeholder="Номер документа"
          name="docNum"
          onChange={this.handleChange}
        />
        <input
          style={{ marginLeft: "5px" }}
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            this.readExcelСommercialOffer(file);
          }}
          onClick={this.handleRepeatFileChange}
        />
        <br />
        <button
          style={{ margin: "10px" }}
          class="btn btn-secondary"
          disabled={
            !(
              this.state.clientName &&
              this.state.companyName &&
              this.state.docNum
            )
          }
          onClick={this.createAndDownloadPdf}
        >
          <b>Скачать коммерческое предложение</b>
        </button>
        <button
          class="btn btn-secondary"
          disabled={this.state.items.length === 0}
          onClick={this.createAndDownloadPdfFromImg}
        >
          <b>Скачать техническое описание</b>
        </button>
        <FAQ />
        <br />
        <div
          style={{
            backgroundColor: "#bbbbbba9",
            marginLeft: "270px",
            marginRight: "270px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <br />
          <h3>
            <b>Добавить новый товар</b>
          </h3>
          <form onSubmit={this.handleAddFormSubmit}>
            <input
              type="text"
              required="required"
              placeholder="Наименование"
              name="ProductName"
              onChange={this.handleAddFormChange}
              value={this.state.addFormData.ProductName}
              style={{ margin: "5px" }}
            />
            {this.state.showModelDropdown && (
              <Dropdown
                data={this.state.database}
                name="Model"
                handleModelSelect={this.handleModelSelect}
                style={{ margin: "5px" }}
              />
            )}
            {!this.state.showModelDropdown && (
              <input
                type="text"
                required="required"
                placeholder="Модель"
                name="Model"
                onChange={this.handleAddFormChange}
                style={{ margin: "5px" }}
              />
            )}
            <input
              type="number"
              required="required"
              placeholder="Количество"
              name="Amount"
              onChange={this.handleAddFormChange}
              style={{ margin: "5px" }}
            />
            <input
              type="text"
              required="required"
              placeholder="Стоимость"
              name="Price"
              onChange={this.handleAddFormChange}
              value={this.state.addFormData.Price}
              style={{ margin: "5px" }}
            />
            <input
              type="text"
              required="required"
              placeholder="Страницы"
              name="PageNumber"
              onChange={this.handleAddFormChange}
              value={this.state.addFormData.PageNumber}
              style={{ margin: "5px" }}
            />
            <Button
              type="submit"
              class="btn btn-success"
              style={{
                backgroundColor: "#24953d",
                border: "none",
                margin: "5px",
              }}
            >
              Добавить
              <i class="bi bi-plus-lg" style={{ marginLeft: "5px" }}></i>
            </Button>
            <Button onClick={this.handleshowModelDropdown}>
              Не из базы
              <i class="bi bi-folder-x" style={{ marginLeft: "5px" }}></i>
            </Button>
          </form>
          <br />
        </div>
        <form onSubmit={this.handleEditFormSubmit}>
          <table class="table container">
            <thead>
              <tr>
                <th scope="col">№</th>
                <th scope="col">Наименование продукции</th>
                <th scope="col">Модель</th>
                <th scope="col">Кол-во</th>
                <th scope="col">Стоимость, руб. Без НДС</th>
                <th scope="col">Страницы</th>
                <th style={{ width: "150px" }} scope="col">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map((rowData) => (
                <Fragment>
                  {this.state.editProductId === rowData.Id ? (
                    <EditableRow
                      editProductId={this.state.editProductId}
                      editFormData={this.state.editFormData}
                      handleEditFormChange={this.handleEditFormChange}
                    />
                  ) : (
                    <ReadOnlyRow
                      rowData={rowData}
                      handleEditClick={this.handleEditClick}
                      handleDeleteClick={this.handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}
