import { useState } from "react";
import "./styles.css";
import LegendInput from "../UI/LegendInput";
import MyButton from "../UI/MyButton";
import { login } from "../api/AuthService";
import useAuth from "../hooks/useAuth";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuth } = useAuth();

  return (
    <div className="Auth">
      <div className="AuthContainer">
        <h2>Пожалуйста, авторизуйтесь</h2>
        <form className="CenteredColumn AuthInputs">
          <LegendInput
            value={email}
            setValue={setEmail}
            inputMode="email"
            type="text"
            disabled={isLoading}
            legend="E-mail*"
          />
          <LegendInput
            value={password}
            setValue={setPassword}
            inputMode="password"
            type="password"
            legend="Пароль*"
            disabled={isLoading}
          />
          <MyButton
            isLoading={isLoading}
            type="submit"
            text="Войти"
            onClick={async (e) => {
              e.preventDefault();
              await login(email, password, setIsLoading, setIsAuth);
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
