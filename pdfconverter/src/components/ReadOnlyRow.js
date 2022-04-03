import React from 'react'
import { Button } from 'react-bootstrap';

const ReadOnlyRow = ({ rowData, handleEditClick, handleDeleteClick }) => {
  return (
    <tr key={rowData.Id}>
        <td>{rowData.Id}</td>
        <td>{rowData.ProductName}</td>
        <td>{rowData.Model}</td>
        <td>{rowData.Amount}</td>
        <td>{rowData.Price}</td>
        <td>{rowData.PageNumber}</td>
        <td>
          <Button
            type="button"
            class="btn btn-primary"
            onClick={(event) => handleEditClick(event, rowData)}
            style={{width: '125px'}}
          >
            Изменить<i class="bi bi-pencil-fill" style={{marginLeft: '10px'}}></i>
          </Button>

          <Button
            type="button"
            class="btn btn-danger"
            onClick={() => handleDeleteClick(rowData.Id)}
            style={{ backgroundColor: '#dc3545', border: 'none', width: '125px', marginTop: '5px' }}
          >
            Удалить<i class="bi bi-trash-fill" style={{marginLeft: '10px'}}></i>
          </Button>
        </td>
    </tr>
  )
}

export default ReadOnlyRow