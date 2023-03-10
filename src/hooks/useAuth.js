import { AuthContext } from "../context";
import { useContext } from "react";

export default function useAuth() {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  return {
    setIsAuth,
    isAuth,
  };
}
