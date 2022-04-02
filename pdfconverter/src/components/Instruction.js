import React, { useState } from 'react'
import "bootstrap-icons/font/bootstrap-icons.css";

const Instruction = () => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
        <button
            class="btn btn-secondary" 
            onClick={() => setIsOpen(!isOpen)}
        >
          <b>Открыть инструкцию</b><i class="bi bi-arrow-down" style={{marginLeft: '10px'}}></i>
        </button>

        {isOpen && 
        <div className="content">
            <br/>
            <p>1. Введите ФИО получателя <u>в именительном падеже</u> (<b>Пример:</b> Иванов Иван Иванович)</p>
            <p>2. Заполните графу с принимающей компанией (<b>Пример:</b> ООО «АРОСА»)</p>
            <p>3. Введите условия оплаты (<b>Пример:</b><br/>10% предоплата;<br/>
                                        50% по факту отгрузки с завода-изготовителя;<br/>
                                        40% после проведения пусконаладочных работ)
            </p>
            <p>5. Введите сроки поставки (<b>Пример:</b> 120-140 дней)</p>
            <p>6. Загрузите данные с поставкой из Excel (<b>Кнопка «Выберите файл»</b>)</p>
            <p>7. Если вас устраивают данные в таблице, то нажмите кнопку <b>«Скачать PDF»</b></p>
            <p>8. После загрузки <u>корректных данных в таблицу</u> нажмите кнопку <b>«Скачать техническое описание»</b></p>
        </div>}
    </div>
  )
}

export default Instruction