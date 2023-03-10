import React from "react";
import cl from "./MyButton.module.css";
import Loading from "../UI/Loading";

function MyButton({
  children,
  style,
  text,
  type,
  onClick,
  isLoading,
  disabled,
  className,
}) {
  return (
    <button
      disabled={isLoading || disabled}
      style={style}
      type={type}
      onClick={onClick}
      className={
        cl.MyButton + " " + (isLoading ? cl.Loading : "") + " " + className
      }
    >
      {children}
      {text}
      <div className={cl.Loader + " " + (isLoading ? cl.LoaderVisible : "")}>
        <Loading which={5} />
      </div>
    </button>
  );
}

export default MyButton;
