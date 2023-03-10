import cl from "./MyCheckBox.module.css";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";
import { useState } from "react";

export default function MyCheckBox({ setChecked }) {
  const [state, setState] = useState(false);

  return (
    <label className={cl.CheckBox}>
      <input
        checked={state}
        onChange={(e) => {
          setChecked(e.target.checked);
          setState(e.target.checked);
        }}
        type={"checkbox"}
      />
      <span className={cl.RoundCheckBox}>
        {state ? (
          <BsCheckCircleFill size={28} color="#2067ff" />
        ) : (
          <BsCheckCircle size={28} color="grey" />
        )}
      </span>
    </label>
  );
}
