import { useState, useEffect } from "react";
import MyInput from "../UI/MyInput";
import MyCheckBox from "../UI/MyCheckBoxPrice";
import MyButton from "../UI/MyButton";
import { getOnePrice, editPrice } from "../api/PriceService";
import { BsChevronLeft } from "react-icons/bs";

import Loading from "../UI/Loading";

function EditPage({ editableId, update, setMobileEditVisible }) {
  const [suk, setSuk] = useState("");
  const [suk2, setSuk2] = useState("");
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [pp1, setpp1] = useState("");
  const [pp2, setpp2] = useState("");
  const [pp3, setpp3] = useState("");
  const [pp4, setpp4] = useState("");
  const [pp5, setpp5] = useState("");
  const data = [
    {
      inputMode: "text",
      title: "Идентификатор товара:",
      type: "text",
      key: "suk",
      state: suk,
      setState: setSuk,
    },
    {
      inputMode: "text",
      title: "Наименование товара у продавца:",
      type: "text",
      key: "suk2",
      state: suk2,
      setState: setSuk2,
    },
    {
      inputMode: "text",
      title: "Модель товара:",
      type: "text",
      key: "model",
      state: model,
      setState: setModel,
    },
    {
      inputMode: "text",
      title: "Бренд товара:",
      type: "text",
      key: "brand",
      state: brand,
      setState: setBrand,
    },
    {
      inputMode: "text",
      title: "Категория товара:",
      type: "text",
      key: "category",
      state: category,
      setState: setCategory,
    },
    {
      inputMode: "numeric",
      title: "Мин. цена:",
      type: "text",
      key: "minprice",
      state: minPrice,
      setState: setMinPrice,
    },
    {
      inputMode: "numeric",
      title: "Актуальная цена:",
      type: "text",
      key: "actualprice",
      state: actualPrice,
      setState: setActualPrice,
    },
    {
      inputMode: "numeric",
      title: "Макс. цена:",
      type: "text",
      key: "maxprice",
      state: maxPrice,
      setState: setMaxPrice,
    },
  ];
  const availabilities = [
    {
      key: "availability",
      title: "PP1",
      state: pp1,
      setState: setpp1,
    },
    {
      key: "availability2",
      title: "PP2",
      state: pp2,
      setState: setpp2,
    },
    {
      key: "availability3",
      title: "PP3",
      state: pp3,
      setState: setpp3,
    },
    {
      key: "availability4",
      title: "PP4",
      state: pp4,
      setState: setpp4,
    },
    {
      key: "availability5",
      title: "PP5",
      state: pp5,
      setState: setpp5,
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    if (editableId) {
      getOnePrice(setIsLoading, data, availabilities, editableId);
    }
  }, [editableId]);

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
    <div className="EditPriceWrapper">
      <span
        className="BackButton"
        onClick={() => {
          setMobileEditVisible(false);
        }}
      >
        <BsChevronLeft />
        Назад
      </span>
      <p
        style={{ textAlign: "center", marginBottom: "20px", fontSize: "18px" }}
      >
        Сейчас редактируется - ID: {editableId}
      </p>
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
      </div>
      <div className="CenteredColumn">
        <p className="InputTitle" style={{ marginTop: "15px" }}>
          Доступность в складах:
        </p>
        <div className="Availabilities">
          {availabilities.map((item) => {
            return (
              <div key={item.key}>
                <MyCheckBox checked={item.state} setChecked={item.setState} />
                <p className="InputTitle">{item.title}</p>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "20px" }} className="CenteredColumn">
          <MyButton
            text="Сохранить"
            type="submit"
            onClick={() => {
              editPrice(
                setIsSaveLoading,
                data,
                availabilities,
                editableId,
                update,
                setMobileEditVisible
              );
            }}
            isLoading={isSaveLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default EditPage;
