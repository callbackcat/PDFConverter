import React from 'react'
import { Button } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";

const EditableRow = ({ editProductId, editFormData, handleEditFormChange }) => {
  return (
    <tr>
        <td>{editProductId}</td>
        <td>
            <input
                type="text"
                required="required"
                placeholder="Наименование"
                name="ProductName"
                value={editFormData.ProductName}
                onChange={handleEditFormChange}
            />
        </td>
        <td>
            <input
                type="text"
                required="required"
                placeholder="Модель"
                name="Model"
                value={editFormData.Model}
                onChange={handleEditFormChange}
            />
        </td>
        <td>
            <input
                type="number"
                required="required"
                placeholder="Количество"
                name="Amount"
                value={editFormData.Amount}
                onChange={handleEditFormChange}
            />
        </td>
        <td>
            <input
                type="text"
                required="required"
                placeholder="Стоимость"
                name="Price"
                value={editFormData.Price}
                onChange={handleEditFormChange}
            />
        </td>
        <td>
            <input
                type="text"
                required="required"
                placeholder="Страницы"
                name="PageNumber"
                value={editFormData.PageNumber}
                onChange={handleEditFormChange}
            />
        </td>
        <td>
            <Button
              type="submit"
              class="btn btn-success"
              style={{ backgroundColor: '#24953d', border: 'none' }}
            >
              Сохранить<i class="bi bi-check-lg" style={{marginLeft: '5px'}}></i>
            </Button>
        </td>
    </tr>
  )
}

export default EditableRow