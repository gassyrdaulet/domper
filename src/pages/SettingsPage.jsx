import { useState, useEffect } from "react";
import MyInput from "../UI/MyInput";
import MyButton from "../UI/MyButton";
import { getUserInfoForEdit, editAccount } from "../api/AuthService";
import Loading from "../UI/Loading";
import Select from "react-select";
import cities from "../api/cities.json";

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [kaspimerlogin, setkaspimerlogin] = useState("");
  const [kaspimerpassword, setKaspimerpassword] = useState("");
  const [mockseller, setMockseller] = useState("");
  const [storeId, setStoreId] = useState("");
  const [damp, setDamp] = useState("");
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [storeName, setStoreName] = useState("");
  const data = [
    {
      inputMode: "email",
      title: "E-mail:",
      type: "text",
      key: "email",
      state: email,
      setState: setEmail,
    },
    {
      inputMode: "text",
      title: "Ваш пароль (оставьте пустым если не хотите менять):",
      type: "password",
      key: "password",
      state: password,
      setState: setPassword,
    },
    {
      inputMode: "text",
      title: "Ваше имя:",
      type: "text",
      key: "name",
      state: name,
      setState: setName,
    },
    {
      inputMode: "number",
      title: "Дэмп (Насколько понижать):",
      type: "text",
      key: "damp",
      state: damp,
      setState: setDamp,
    },
    {
      inputMode: "text",
      title: "Название магазина:",
      type: "text",
      key: "store_name",
      state: storeName,
      setState: setStoreName,
    },
    {
      inputMode: "text",
      title: "ID магазина:",
      type: "text",
      key: "store_id",
      state: storeId,
      setState: setStoreId,
    },
    {
      inputMode: "text",
      title: "Логин кабинета продавца:",
      type: "text",
      key: "kaspimerlogin",
      state: kaspimerlogin,
      setState: setkaspimerlogin,
    },
    {
      inputMode: "text",
      title:
        "Пароль кабинета продавца (оставьте пустым если не хотите менять):",
      type: "password",
      key: "kaspimerpassword",
      state: kaspimerpassword,
      setState: setKaspimerpassword,
    },
    {
      inputMode: "text",
      title: "Мокинг партнера (Введите его ID):",
      type: "text",
      key: "mockseller",
      state: mockseller,
      setState: setMockseller,
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const selectStyle = {
    option: (provided) => ({
      ...provided,
      fontSize: 10,
      color: "black",
    }),
    menu: (provided) => ({
      ...provided,
    }),
    menuList: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
    control: () => ({
      display: "flex",
      minWidth: 190,
      maxWidth: 190,
      maxHeight: 40,
      fontSize: 13,
      background: "white",
      border: "1px solid #c0c0c0",
      borderRadius: "3px",
      cursor: "pointer",
      fontWeight: "600",
    }),
  };

  useEffect(() => {
    const temp = [];
    for (let city of cities.data) {
      if (city.attributes.active === true) {
        temp.push({
          value: city.attributes.code,
          label: city.attributes.name,
        });
      }
    }
    setCityOptions(temp);
  }, []);
  useEffect(() => {
    for (let candidate of cities.data) {
      if (candidate.attributes.code === city) {
        setCityName(candidate.attributes.name);
        break;
      }
    }
  }, [city]);
  useEffect(() => {
    getUserInfoForEdit(setIsLoading, data, setCity);
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
      <div className="CenteredColumn">
        {data.map((item) => {
          return (
            <div key={item.key} className="InputsWrapper">
              <p className="InputTitle">{item.title}</p>
              <MyInput
                inputMode={item.inputMode}
                type={item.type}
                value={item.state}
                setValue={item.setState}
              />
            </div>
          );
        })}
        <div className="InputsWrapper">
          <p style={{ marginBottom: "10px" }} className="InputTitle">
            Город{` (Текущий: ${cityName}):`}
          </p>
          <Select
            defaultValue={city}
            onChange={({ value }) => setCity(value)}
            styles={selectStyle}
            options={cityOptions}
          />
        </div>
        <div
          style={{ marginTop: "30px", marginBottom: "50px" }}
          className="CenteredColumn"
        >
          <MyButton
            text="Сохранить"
            type="submit"
            onClick={() => {
              editAccount(setIsSaveLoading, data, city);
            }}
            isLoading={isSaveLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
