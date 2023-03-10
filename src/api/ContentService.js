import axios from "axios";
import { server_url } from "./AuthService";

export const getVideos = async (setIsLoading, setData) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  await axios
    .post(
      server_url + "/api/content/gethelp",
      { type: "video" },
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    )
    .then(({ data }) => {
      setData(data);
    })
    .catch((err) => {
      alert(
        "Ошибка: " +
          (err.response?.data?.errors
            ? err.response?.data?.errors.errors[0].msg
            : err.response?.data?.message
            ? err.response?.data?.message
            : err.message)
      );
    })
    .finally(() => setIsLoading(false));
};

export const getPosts = async (setIsLoading, setData) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  await axios
    .post(
      server_url + "/api/content/gethelp",
      { type: "clasfaq" },
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    )
    .then(({ data }) => {
      setData(data);
    })
    .catch((err) => {
      alert(
        "Ошибка: " +
          (err.response?.data?.errors
            ? err.response?.data?.errors.errors[0].msg
            : err.response?.data?.message
            ? err.response?.data?.message
            : err.message)
      );
    })
    .finally(() => setIsLoading(false));
};
