import React from 'react'
import { Button } from 'react-bootstrap';

const ReadOnlyRow = ({ rowData, handleEditClick }) => {
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
          >
            Изменить<i class="bi bi-pencil-fill" style={{marginLeft: '10px'}}></i>
          </Button>
        </td>
    </tr>
  )
}

export default ReadOnlyRow