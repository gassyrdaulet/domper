import { Route, Routes } from "react-router-dom";
import { publicRoutes, userRoutes } from "../router";
import React, { useContext } from "react";
import { AuthContext } from "../context";
import Loading from "../UI/Loading";

function AppRouter() {
  const { isAuth, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <Loading which={0} />
      </div>
    );
  }
  return isAuth ? (
    <Routes>
      {userRoutes.map(({ path, element }) => (
        <Route path={path} element={element} key={path} />
      ))}
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route path={path} element={element} key={path} />
      ))}
    </Routes>
  );
}

export default AppRouter;
