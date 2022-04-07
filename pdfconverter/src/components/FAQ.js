import React, { useState } from "react";
import Faq from "react-faq-component";
import "bootstrap-icons/font/bootstrap-icons.css";

// FAQ Wrapper
const FAQ = () => {
  const [isOpen, setIsOpen] = useState(false);

  const data = {
    title: <p></p>,
    rows: [
      {
        title: "Как создать коммерческое предложение?",
        content: (
          <p style={{ lineHeight: 1.2 }}>
            1. Введите ФИО получателя <u>в именительном падеже</u>
            <br />(<b>Пример:</b> Иванов Иван Иванович)
            <br />
            <br />
            2. Заполните графу с принимающей компанией
            <br />(<b>Пример:</b> ООО «АРОСА»)
            <br />
            <br />
            3. При необходимости введите условия оплаты и доставки
            <br />
            <br />
            4. Укажите номер документа и нажмите кнопку{" "}
            <b>«Скачать коммерческое предложение»</b>
          </p>
        ),
      },
      {
        title: "Как создать техническое описаниe?",
        content: (
          <p>
            1. Загрузите необходимые данные в таблицу и по желанию измените
            <br />
            2. <u>Проверьте корректность</u> введенных страниц в каталоге{" "}
            <i
              class="bi bi-exclamation-triangle"
              style={{ color: "#ff751a", fontSize: "16px" }}
            ></i>
            <br />
            3. Нажмите кнопку <b>«Скачать техническое описание»</b>
          </p>
        ),
      },
      {
        title: "Откуда брать базу данных?",
        content: (
          <p>
            База данных берется из файла <b>./database.xlsl</b>, который должен
            находиться в директории сервера
          </p>
        ),
      },
      {
        title: "Кнопки не работают!",
        content: (
          <p>
            Все кнопки будут доступны после заполнения соответствующих полей :)
          </p>
        ),
      },
    ],
  };

  const styles = {
    bgColor: "#f0f0f0",
    rowTitleColor: "blue",
    rowTitleTextSize: "17px",
  };

  return (
    <div style={{ width: "690px", margin: "auto" }}>
      <button class="btn btn-secondary" onClick={() => setIsOpen(!isOpen)}>
        <b>Открыть инструкцию</b>
        <i class="bi bi-arrow-down" style={{ marginLeft: "10px" }}></i>
      </button>
      <p style={{ textAlign: "left" }}>
        {isOpen && <Faq data={data} styles={styles} />}
      </p>
    </div>
  );
};

export default FAQ;
