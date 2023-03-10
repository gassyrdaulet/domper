import { Navigate } from "react-router-dom";
import Auth from "../pages/AuthPage";
import Main from "../pages/MainPage";
import Error from "../pages/ErrorPage";

export const userRoutes = [
  { path: "/main", element: <Main></Main> },
  { path: "/", element: <Navigate to="/main"></Navigate> },
  { path: "/auth", element: <Navigate to="/"></Navigate> },
  { path: "/error", element: <Error></Error> },
  { path: "/*", element: <Navigate to="/error"></Navigate> },
];

export const adminRoutes = [];

export const publicRoutes = [
  { path: "/auth", element: <Auth></Auth> },
  { path: "/error", element: <Error></Error> },
  { path: "/*", element: <Navigate to="/auth"></Navigate> },
];
