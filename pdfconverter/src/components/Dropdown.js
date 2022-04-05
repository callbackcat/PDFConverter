import React from "react";

const Dropdown = ({ data, handleModelSelect }) => {
  return (
    <select
      id="modelsList"
      onChange={(event) => handleModelSelect(event)}
      style={{ width: "189px", height: "31px" }}
    >
      {data.map((item) => (
        <option key={item.Model}>{item.Model}</option>
      ))}
    </select>
  );
};

export default Dropdown;
