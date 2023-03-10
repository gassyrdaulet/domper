import { useState, useEffect } from "react";
import { getUserInfo } from "../api/AuthService";
import Loading from "../UI/Loading";
import { BsFiles } from "react-icons/bs";
import CopyToClipboard from "react-copy-to-clipboard";

function XMLview() {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getUserInfo(setIsLoading, setData);
  }, []);
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading which={0} />
        <p style={{ marginTop: 15 }}>Загрузка...</p>
      </div>
    );
  }
  return (
    <div>
      Перейдите по ссылке для просмотра:
      <br />
      <br />
      <a href={data.linkxml}>{data.linkxml}</a>
      <br />
      <br />
      <CopyToClipboard
        onCopy={() => {
          alert("Успешно скопировано!");
        }}
        text={data.linkxml}
      >
        <div
          style={{ alignItems: "center", display: "flex", cursor: "pointer" }}
        >
          <p style={{ marginRight: "5px", textDecoration: "underline" }}>
            Нажмите для копирования
          </p>
          <BsFiles size={25} />
        </div>
      </CopyToClipboard>
    </div>
  );
}

export default XMLview;
