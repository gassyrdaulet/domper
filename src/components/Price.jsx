import cl from "./Price.module.css";
import MyCheckBox from "../UI/MyCheckBoxPrice";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  BsFiles,
  BsLightbulbOff,
  BsLightbulb,
  BsTrashFill,
  BsPower,
  BsPencilSquare,
} from "react-icons/bs";
import MyButton from "../UI/MyButton";
import { deletePrice, changePriceActivity } from "../api/PriceService";
import { useState } from "react";
const kaspiShopUrl = "https://kaspi.kz/shop/p/-";

export default function Price({
  data,
  index,
  checked,
  setChecked,
  update,
  setEditableId,
  setMobileEditVisible,
}) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isChangeLoading, setIsChangeLoading] = useState(false);

  return (
    <div className={cl.Price + " " + (checked ? cl.checked : "")}>
      <div className={cl.horizontalthree}>
        <div className={cl.index}>
          <div>
            <MyCheckBox
              checked={checked}
              setChecked={(v) => setChecked(data.id, v)}
            />
          </div>
          <div className={cl.hint}>{index + 1}</div>
        </div>
        <div>
          {data.activated === "yes" ? (
            <BsLightbulb size={18} color="#33ff33" />
          ) : (
            <BsLightbulbOff size={18} color="#ff3333" />
          )}
        </div>
        <div className={cl.hint}>{data.id}</div>
      </div>
      <div className={cl.sku}>
        <a
          target="blank"
          style={{ textDecoration: "underline", cursor: "pointer" }}
          href={
            kaspiShopUrl + data.suk + "/?m=" + localStorage.getItem("store_id")
          }
        >
          {data.suk}
        </a>
        <CopyToClipboard
          onCopy={() => {
            alert("Успешно скопировано!");
          }}
          text={
            kaspiShopUrl + data.suk + "/?m=" + localStorage.getItem("store_Id")
          }
        >
          <BsFiles style={{ cursor: "pointer" }} size={18} />
        </CopyToClipboard>
      </div>
      <div className={cl.model}>{data.brand + " " + data.model}</div>
      <div className={cl.category}>
        <p className={cl.hint}>
          {data.category ? data.category : "Категория"}{" "}
          {new Date(data.date).toLocaleString("ru")}
        </p>
      </div>
      <div className={cl.horizontalthree}>
        <div className={cl.cost}>
          <div className={cl.hint}>Мин.:</div>
          <div>{data.minprice}</div>
        </div>
        <div className={cl.cost}>
          <div className={cl.hint}>Сейч.:</div>
          <div>{data.actualprice}</div>
        </div>
        <div className={cl.cost}>
          <div className={cl.hint}>Макс.:</div>
          <div>{data.maxprice}</div>
        </div>
      </div>
      <div className={cl.horizontaltwo}>
        <div className={cl.pp}>
          <p className={cl.hint}>PP:</p>
          <p
            className={
              data.availability?.$?.available === "yes" ? cl.ppgreen : cl.ppred
            }
          >
            1
          </p>
          <p
            className={
              data.availability2?.$?.available === "yes" ? cl.ppgreen : cl.ppred
            }
          >
            2
          </p>
          <p
            className={
              data.availability3?.$?.available === "yes" ? cl.ppgreen : cl.ppred
            }
          >
            3
          </p>
          <p
            className={
              data.availability4?.$?.available === "yes" ? cl.ppgreen : cl.ppred
            }
          >
            4
          </p>
          <p
            className={
              data.availability5?.$?.available === "yes" ? cl.ppgreen : cl.ppred
            }
          >
            5
          </p>
        </div>
        <div className={cl.buttons}>
          <MyButton
            className={cl.Button}
            isLoading={isChangeLoading}
            onClick={() => {
              if (
                window.confirm(
                  `Вы уверены что хотите ${
                    data.activated === "yes" ? "деактивировать" : "активировать"
                  } данный прайс? (ID: ${data.id})`
                )
              ) {
                changePriceActivity(
                  setIsChangeLoading,
                  { [data.id]: true },
                  !(data.activated === "yes"),
                  update
                );
              }
            }}
          >
            <BsPower size={20} />
          </MyButton>
          <MyButton
            className={cl.Button}
            isLoading={isDeleteLoading}
            onClick={() => {
              if (
                window.confirm(
                  `Вы уверены что хотите удалить данный прайс? (ID: ${data.id})`
                )
              ) {
                deletePrice(setIsDeleteLoading, { [data.id]: true }, update);
              }
            }}
          >
            <BsTrashFill size={20} />
          </MyButton>
          <MyButton
            className={cl.Button}
            onClick={() => {
              setEditableId(data.id);
              setMobileEditVisible(true);
            }}
          >
            <BsPencilSquare size={20} />
          </MyButton>
        </div>
      </div>
    </div>
  );
}
