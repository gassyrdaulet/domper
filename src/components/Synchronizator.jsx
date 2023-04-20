import { useState } from "react";
import MyButton from "../UI/MyButton";
import LegendInput from "../UI/LegendInput";
import cl from "./Synchronizator.module.css";
import { signIn, sync } from "../api/PriceService";
import Loading from "../UI/Loading";

function Synchronizator({ close, update }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [syncError, setSyncError] = useState("");
  const [totalUploadedOffers, setTotalUploadedOffers] = useState(0);
  const [phase, setPhase] = useState(0);
  const [successText, setSuccessText] = useState("");

  const next = async (newOffers, oldOffers, store_id) => {
    setIsSyncLoading(true);
    try {
      setTotalUploadedOffers(newOffers.length);
      let totalNewOffers = 0;
      let deactivatedOffersBefore = 0;
      let activatedOffersAfter = 0;
      let totalOldOffers = oldOffers.length;
      setPhase(1);
      oldOffers.forEach((offer) => {
        if (offer.activated !== "no") {
          offer.activated = "no";
        } else {
          deactivatedOffersBefore++;
        }
      });
      for (let newOffer of newOffers) {
        let nothingFound = true;
        for (let oldOffer of oldOffers) {
          if (newOffer.masterProduct.sku === oldOffer.suk) {
            oldOffer.activated = "yes";
            nothingFound = false;
            activatedOffersAfter++;
            break;
          }
        }
        if (nothingFound) {
          const newCreateOffer = {};
          for (let itr = 1; itr <= 5; itr++) {
            const key = "availability" + (itr === 1 ? "" : itr);
            newCreateOffer[key] = JSON.stringify({
              $: {
                storeId: "PP" + itr,
                available: itr === 1 || itr === 2 ? "yes" : "no",
              },
            });
          }
          oldOffers.push({
            ...newCreateOffer,
            id: "new",
            activated: "yes",
            suk: newOffer.masterProduct.sku,
            suk2: newOffer.masterProduct.sku + `_${store_id}`,
            model: newOffer.name,
            brand: newOffer.brand ? newOffer.brand : "Бренд",
            category: "Категория",
            minprice: newOffer.priceMin,
            actualprice: newOffer.priceMin,
            maxprice: newOffer.priceMin + 100,
          });
          totalNewOffers++;
        }
      }
      await sync(oldOffers, setSyncError, setIsSyncLoading);
      setSuccessText(
        `Синхронизация прошла успешно!\nБыло товаров: ${totalOldOffers}шт.\nНовых товаров: ${totalNewOffers}шт.\nДеактивировано: ${
          totalOldOffers - activatedOffersAfter - deactivatedOffersBefore
        }шт.`
      );
      setIsSyncLoading(false);
    } catch (e) {
      setSyncError(`Ошибка в синхронизации ${e.message}`);
      setIsSyncLoading(false);
    }
  };

  return (
    <div className={cl.Main}>
      <div className={phase === 0 ? cl.Credentials : cl.Hide}>
        <LegendInput
          value={login}
          setValue={setLogin}
          type="text"
          legend="Логин Кабинета Продавца"
          inputMode="text"
          disabled={isSignInLoading}
        />
        <LegendInput
          value={password}
          setValue={setPassword}
          type="password"
          legend="Пароль"
          inputMode="text"
          disabled={isSignInLoading}
        />
        <MyButton
          onClick={() => {
            signIn(login, password, setIsSignInLoading, setSignInError, next);
          }}
          text="Синхронизировать"
          isLoading={isSignInLoading}
        />
        <MyButton onClick={close} text="Закрыть" />
        <p style={{ color: "red" }}>{signInError}</p>
      </div>
      <div className={phase === 1 ? cl.Credentials : cl.Hide}>
        <p style={{ textAlign: "center" }}>
          Успешный вход в Кабинет Продавца! Выгружено {totalUploadedOffers}{" "}
          товаров.
        </p>
        {isSyncLoading ? (
          <div className={cl.CenteredView}>
            <Loading which={5} />
            <p style={{ textAlign: "center" }}>
              Выполняется синхронизация с Domper...
            </p>
          </div>
        ) : (
          <div className={cl.CenteredView}>
            <p style={{ textAlign: "center" }}>{successText}</p>
            <MyButton
              style={{ marginTop: 20 }}
              text="Обновить"
              onClick={() => {
                close();
                setPhase(0);
                update();
              }}
            />
          </div>
        )}
        <p style={{ color: "red" }}>{syncError}</p>
      </div>
    </div>
  );
}

export default Synchronizator;
