import cl from "./MyCheckBox.module.css";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";

export default function MyCheckBoxPrice({ checked, setChecked }) {
  return (
    <label className={cl.CheckBox}>
      <input
        checked={checked === undefined ? "" : checked}
        onChange={(e) => {
          setChecked(e.target.checked);
        }}
        type={"checkbox"}
      />
      <span className={cl.RoundCheckBox}>
        {checked ? (
          <BsCheckCircleFill size={28} color="#2067ff" />
        ) : (
          <BsCheckCircle size={28} color="grey" />
        )}
      </span>
    </label>
  );
}
