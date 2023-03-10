import React from "react";
import ErrorImg from "../img/ErrorImg.svg";

function ErrorPage({ router }) {
  return (
    <div
      style={{
        backgroundColor: "#18212b",
        marginBottom: "100px",
        paddingBottom: "80px",
      }}
      className="CenteredColumn"
    >
      <img style={{ width: "80%", maxWidth: "500px" }} src={ErrorImg} alt="" />
      <h2>Ошибка 404</h2>
      <a href="/">На главную</a>
    </div>
  );
}

export default ErrorPage;
