import React from "react";
import cl from "./LegendInput.module.css";

function LegendInput({
  value,
  setValue,
  type,
  legend,
  inputMode,
  placeholder,
  list,
  disabled,
}) {
  return (
    <div className={cl.LegendInput}>
      <p>{legend}</p>
      <input
        disabled={disabled}
        list={list}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputMode={inputMode}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

export default LegendInput;
