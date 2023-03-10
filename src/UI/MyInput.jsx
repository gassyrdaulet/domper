import React from "react";
import cl from "./MyInput.module.css";

function MyInput({
  type,
  placeholder,
  list,
  value,
  setValue,
  onBlur,
  inputMode,
  disabled,
}) {
  return (
    <div className={cl.MyInputWrapper}>
      <input
        disabled={disabled}
        list={list}
        onBlur={onBlur}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        inputMode={inputMode}
        className={cl.MyInput}
        type={type}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

export default MyInput;
