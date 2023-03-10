import "./App.css";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./context";
import AppRouter from "./components/AppRouter";
import Header from "./components/Header";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          isAuth,
          setIsAuth,
          isLoading,
        }}
      >
        <div className="Body">
          <Header />
          <AppRouter />
        </div>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
