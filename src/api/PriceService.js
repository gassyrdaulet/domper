import axios from "axios";
import { server_url } from "./AuthService";

export const newPrice = async (setIsLoading, data, availabilities) => {
  setIsLoading(true);
  const rData = {};
  data.forEach((item) => {
    rData[item.key] = item.value;
  });
  availabilities.forEach((item) => {
    rData[item.key] = item.value ? "yes" : "no";
  });
  const token = localStorage.getItem("token");
  axios
    .post(
      `${server_url}/api/prices/newprice`,
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

export const editPrice = async (
  setIsLoading,
  data,
  availabilities,
  priceid,
  update,
  setVisible
) => {
  setIsLoading(true);
  const rData = {};
  data.forEach((item) => {
    rData[item.key] = item.state;
  });
  availabilities.forEach((item) => {
    rData[item.key] = item.state ? "yes" : "no";
  });
  const token = localStorage.getItem("token");
  axios
    .post(
      `${server_url}/api/prices/editprice`,
      {
        ...rData,
        priceid,
      },
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    )
    .then(({ data }) => {
      alert(data.message);
      update();
      setVisible(false);
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

export const getBrands = async (searchValue) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(server_url + "/api/prices/brands", {
    params: {
      searchValue,
    },
    headers: {
      authorization: "Bearer " + token,
    },
  });
  return data;
};

export const getCategories = async (searchValue) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(server_url + "/api/prices/categories", {
    params: {
      searchValue,
    },
    headers: {
      authorization: "Bearer " + token,
    },
  });
  return data;
};

export const getOnePrice = async (
  setIsLoading,
  setData,
  setAvailabilities,
  priceid
) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  await axios
    .post(
      server_url + "/api/prices/details",
      {
        priceid,
      },
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    )
    .then(({ data: res }) => {
      const [data] = res;
      setData.forEach((item) => {
        item.setState(data[item.key]);
      });
      setAvailabilities.forEach((item) => {
        item.setState(data[item.key].$.available === "yes");
      });
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

export const getAllPrices = async (setIsLoading, setData) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  await axios
    .post(
      server_url + "/api/prices/all",
      {},
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
      setData([]);
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

export const deletePrice = async (setIsLoading, price_ids, update) => {
  const token = localStorage.getItem("token");
  setIsLoading(true);
  await axios
    .post(
      server_url + "/api/prices//delete",
      {
        price_ids,
      },
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    )
    .then(({ data }) => {
      alert(data.message);
      update();
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

export const changePriceActivity = async (
  setIsLoading,
  price_ids,
  value,
  update
) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  await axios
    .post(
      server_url + "/api/prices/change",
      {
        price_ids,
        value,
      },
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    )
    .then(({ data }) => {
      alert(data.message);
      update();
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
