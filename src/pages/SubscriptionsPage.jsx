import { useEffect, useState } from "react";
import { getUserInfoSub } from "../api/AuthService";
import Loading from "../UI/Loading";
import Moment from "moment";
import { BsWhatsapp } from "react-icons/bs";

function SubscriptionsPage() {
  const [expiryMs, setExpiryMs] = useState(0);
  const [difference, setDifference] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    getUserInfoSub(setIsLoading, setExpiryMs, setDifference, setWhatsappNumber);
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
      <p>
        {difference > 0
          ? `До конца Вашей подписки осталось: ${Math.floor(
              Moment.duration(difference, "milliseconds").asDays()
            )} дней и ${Math.floor(
              Moment.duration(difference, "milliseconds").hours()
            )} чаcа.`
          : `Ваша подписка неактивна (была окончена ${Moment(expiryMs)}).`}
      </p>
      <br />
      <br />
      <p>
        По всем вопросам о подписке Вы можете обратиться по следующим контактам:{" "}
      </p>
      <br />
      <br />
      <div className="CenteredColumn">
        <a target="blank" href={"https://wa.me/" + whatsappNumber}>
          <BsWhatsapp style={{ cursor: "pointer" }} size={100} />
        </a>
      </div>
    </div>
  );
}

export default SubscriptionsPage;
