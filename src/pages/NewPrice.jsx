import { useState } from "react";
import MyInput from "../UI/MyInput";
import MyCheckBox from "../UI/MyCheckBox";
import MyButton from "../UI/MyButton";
import { newPrice } from "../api/PriceService";
import useAuth from "../hooks/useAuth";

function NewPrice() {
  const { setIsAuth } = useAuth();
  const [data, setData] = useState([
    {
      value: "",
      inputMode: "text",
      title: "Идентификатор товара:",
      type: "text",
      key: "suk",
    },
    {
      value: "",
      inputMode: "text",
      title: "Наименование товара у продавца:",
      type: "text",
      key: "suk2",
    },
    {
      value: "",
      inputMode: "text",
      title: "Модель товара:",
      type: "text",
      key: "model",
    },
    {
      value: "",
      inputMode: "text",
      title: "Бренд товара:",
      type: "text",
      key: "brand",
    },
    {
      value: "",
      inputMode: "text",
      title: "Категория товара:",
      type: "text",
      key: "category",
    },
    {
      value: "",
      inputMode: "numeric",
      title: "Мин. цена:",
      type: "text",
      key: "minprice",
    },
    {
      value: "",
      inputMode: "numeric",
      title: "Макс. цена:",
      type: "text",
      key: "maxprice",
    },
  ]);
  const [availabilities, setAvailabilities] = useState([
    { key: "availability", value: false, title: "PP1" },
    { key: "availability2", value: false, title: "PP2" },
    { key: "availability3", value: false, title: "PP3" },
    { key: "availability4", value: false, title: "PP4" },
    { key: "availability5", value: false, title: "PP5" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const setValueInData = (index, value) => {
    try {
      const temp = data;
      temp[index].value = value;
      setData(temp);
    } catch (e) {
      alert(e?.message);
      console.log(e);
    }
  };
  const setAvailabilityInArr = (index, value) => {
    try {
      const temp = availabilities;
      availabilities[index].value = value;
      setAvailabilities(temp);
    } catch (e) {
      alert(e?.message);
      console.log(e);
    }
  };

  return (
    <div className="NewPriceWrapper">
      <div className="CenteredColumn">
        {data.map((item, index) => {
          return (
            <div key={item.key} className="InputsWrapper">
              <p className="InputTitle">{item.title}</p>
              <MyInput
                inputMode={item.inputMode}
                type={item.type}
                // value={item.value}
                setValue={(value) => {
                  setValueInData(index, value);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="NewPriceSecondHalf">
        <p className="InputTitle" style={{ marginTop: "15px" }}>
          Доступность в складах:
        </p>
        <div className="Availabilities">
          {availabilities.map((item, index) => {
            return (
              <div key={item.key}>
                <MyCheckBox
                  setChecked={(value) => {
                    setAvailabilityInArr(index, value);
                  }}
                />
                <p className="InputTitle">{item.title}</p>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "20px" }} className="CenteredColumn">
          <MyButton
            text="Добавить"
            type="submit"
            onClick={() => {
              newPrice(setIsLoading, data, availabilities, setIsAuth);
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default NewPrice;
