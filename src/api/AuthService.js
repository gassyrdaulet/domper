import axios from "axios";
export const server_url = "https://64.227.36.152:3636";

export const login = async (email, password, setIsLoading, setIsAuth) => {
  setIsLoading(true);
  axios
    .post(`${server_url}/api/auth/login`, {
      email: email.toLowerCase(),
      password,
    })
    .then(({ data }) => {
      setIsAuth(true);
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_name", data.user.name);
      localStorage.setItem("store_id", data.user.store_id);
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

export const logout = (setIsLoading, setIsAuth) => {
  try {
    setIsLoading(true);
    setIsAuth(false);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("store_id");
    setIsLoading(false);
  } catch (e) {
    console.log(e);
  }
};

export const getUserInfo = async (setIsLoading, setProfileData) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  axios
    .get(`${server_url}/api/auth/userinfo`, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
    .then(async ({ data }) => {
      setProfileData({
        username: data.user.name,
        store_name: data.user.store_name,
        store_id: data.user.store_id,
        linkxml: data.user.linkxml,
      });
    })
    .catch((err) => {
      alert(
        "Ошибка",
        err.response?.data?.errors
          ? err.response?.data?.errors.errors[0].msg
          : err.response?.data?.message
          ? err.response?.data?.message
          : err.message
      );
    })
    .finally(() => setIsLoading(false));
};

export const getUserInfoSub = async (
  setIsLoading,
  setExpiryMs,
  setDifference,
  setWhatsappNumber
) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  axios
    .get(`${server_url}/api/auth/userinfo`, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
    .then(async ({ data }) => {
      setExpiryMs(data.user.expiryms);
      setDifference(data.user.difference);
      setWhatsappNumber(data.user.whatsapp);
    })
    .catch((err) => {
      alert(
        "Ошибка",
        err.response?.data?.errors
          ? err.response?.data?.errors.errors[0].msg
          : err.response?.data?.message
          ? err.response?.data?.message
          : err.message
      );
    })
    .finally(() => setIsLoading(false));
};

export const getUserInfoForEdit = async (
  setIsLoading,
  setProfileData,
  setCity
) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  axios
    .get(`${server_url}/api/auth/userinfo`, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
    .then(async ({ data }) => {
      setProfileData.forEach((item) => {
        if (item.key === "password") return;
        item.setState(data.user[item.key]);
      });
      setCity(data.user.city);
    })
    .catch((err) => {
      alert(
        "Ошибка",
        err.response?.data?.errors
          ? err.response?.data?.errors.errors[0].msg
          : err.response?.data?.message
          ? err.response?.data?.message
          : err.message
      );
    })
    .finally(() => setIsLoading(false));
};

export const editAccount = async (setIsLoading, data, city) => {
  setIsLoading(true);
  const rData = {};
  data.forEach((item) => {
    if (item.key === "password") {
      if (item.state === "") {
        rData[item.key] = "EynNY@D4870064";
        return;
      }
    }
    rData[item.key] = item.state;
  });
  rData.city = city;
  const token = localStorage.getItem("token");
  axios
    .post(
      `${server_url}/api/auth/edit`,
      {
        ...rData,
      },
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    )
    .then(({ data }) => {
      alert(data.message);
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
