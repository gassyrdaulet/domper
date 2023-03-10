import { useState, useEffect, useMemo } from "react";
import Price from "../components/Price";
import debounce from "lodash.debounce";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Loading from "../UI/Loading";
import MyButton from "../UI/MyButton";
import MyCheckBox from "../UI/MyCheckBoxPrice";
import LegendInput from "../UI/LegendInput";
import {
  getBrands,
  getCategories,
  deletePrice,
  changePriceActivity,
  getAllPrices,
} from "../api/PriceService";
import EditPage from "./EditPage";

function PricesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isChangeLoading, setIsChangeLoading] = useState(false);
  const [allMarked, setAllMarked] = useState(false);
  const [markedIDS, setMarkedIDS] = useState({});
  const [markMode, setMarkMode] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [editableId, setEditableId] = useState();
  const [mobileEditVisible, setMobileEditVisible] = useState(false);

  const [firstSortSelectValue, setFirstSortSelectValue] = useState({
    value: "brand",
    label: "По бренду",
  });
  const [modelSelectValue, setModelSortSelectValue] = useState({
    value: 1,
    label: "По возраст.",
  });
  const [activatedSelectValue, setActivatedSortSelectValue] = useState({
    value: "all",
    label: "Все",
  });
  const [categorySelectValue, setCategorySortSelectValue] = useState({
    value: "all",
    label: "Все",
  });
  const [brandSelectValue, setBrandSortSelectValue] = useState({
    value: "all",
    label: "Все",
  });
  const [availabilitySelectValue, setAvailabilitySortSelectValue] = useState({
    value: "all",
    label: "Все",
  });
  const [idSelectValue, setIdSortSelectValue] = useState({
    value: 1,
    label: "По возраст.",
  });
  const [dateSelectValue, setDateSortSelectValue] = useState({
    value: 1,
    label: "Сперва новые",
  });

  const options = [
    { value: "model", label: "По наименов." },
    { value: "activated", label: "По активности" },
    { value: "category", label: "По категории" },
    { value: "brand", label: "По бренду" },
    { value: "availability", label: "По складам" },
    { value: "id", label: "По ID" },
    { value: "date", label: "Дата обновления" },
  ];
  const availabilityOptions = [
    { value: "all", label: "Все" },
    { value: "nowhere", label: "Нигде" },
    { value: "", label: "PP1" },
    { value: "2", label: "PP2" },
    { value: "3", label: "PP3" },
    { value: "4", label: "PP4" },
    { value: "5", label: "PP5" },
  ];
  const whichFirstOptionsDate = [
    { value: 1, label: "Сперва новые" },
    { value: -1, label: "Сперва старые" },
  ];
  const whichFirstOptionsActivation = [
    {
      value: "all",
      label: "Все",
    },
    {
      value: "yes",
      label: "Активные",
    },
    {
      value: "no",
      label: "Неактивные",
    },
  ];
  const whichFirstOptions = [
    { value: 1, label: "По возраст." },
    { value: -1, label: "По убыванию" },
  ];
  const selectStyle = {
    option: (provided) => ({
      ...provided,
      fontSize: 8,
      color: "black",
    }),
    menu: (provided) => ({
      ...provided,
    }),
    menuList: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
    control: () => ({
      display: "flex",
      minWidth: 100,
      maxWidth: 100,
      maxHeight: 40,
      fontSize: 10,
      background: "white",
      border: "1px solid #c0c0c0",
      borderRadius: "5px",
      cursor: "pointer",
    }),
  };

  const sortedPrices = useMemo(() => {
    try {
      let sortedArray = [];
      switch (firstSortSelectValue.value) {
        case "model":
          sortedArray = [...data].sort((a, b) => {
            return modelSelectValue.value * a.model.localeCompare(b.model);
          });
          return sortedArray;
        case "activated":
          sortedArray = [...data].sort((a, b) => {
            return b.activated?.localeCompare(a.activated);
          });
          if (activatedSelectValue?.value !== "all") {
            sortedArray = [...sortedArray].filter((price) => {
              return price.activated.includes(activatedSelectValue.value);
            });
          }
          return sortedArray;
        case "category":
          sortedArray = [...data].sort((a, b) => {
            return a.category.localeCompare(b.category);
          });
          if (categorySelectValue?.value !== "all") {
            sortedArray = [...sortedArray].filter((price) => {
              return price.category.includes(categorySelectValue.value);
            });
          }
          return sortedArray;
        case "brand":
          sortedArray = [...data].sort((a, b) => {
            return a.brand.localeCompare(b.brand);
          });
          if (brandSelectValue?.value !== "all") {
            sortedArray = [...sortedArray].filter((price) => {
              return price.brand.includes(brandSelectValue.value);
            });
          }
          return sortedArray;
        case "availability":
          sortedArray = [...data].sort((a, b) => {
            return a.brand.localeCompare(b.brand);
          });
          if (availabilitySelectValue.value === "nowhere") {
            sortedArray = [...sortedArray].filter((price) => {
              let nowhere = true;
              for (let i = 1; i <= 5; i++) {
                if (price["availability"].$.available === "yes") {
                  nowhere = false;
                  break;
                }
              }
              return nowhere;
            });
          }
          if (availabilitySelectValue.value === "all") {
            return sortedArray;
          }
          sortedArray = [...sortedArray].filter((price) => {
            return (
              price["availability" + availabilitySelectValue.value].$
                .available === "yes"
            );
          });
          return sortedArray;
        case "id":
          sortedArray = [...data].sort((a, b) => {
            return idSelectValue.value * (a.id - b.id);
          });
          return sortedArray;
        case "date":
          sortedArray = [...data].sort((a, b) => {
            return (
              dateSelectValue.value *
              (b.date < a.date ? -1 : b.date > a.date ? 1 : 0)
            );
          });
          return sortedArray;
        default:
          return [];
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  }, [
    data,
    firstSortSelectValue,
    modelSelectValue,
    activatedSelectValue,
    categorySelectValue,
    brandSelectValue,
    availabilitySelectValue,
    idSelectValue,
    dateSelectValue,
  ]);
  const filteredPrices = useMemo(() => {
    try {
      const temp = [...sortedPrices].filter((price) => {
        return (
          price.model.toLowerCase().includes(searchInput.toLowerCase()) ||
          (price.id + "").toLowerCase().includes(searchInput.toLowerCase()) ||
          price.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
          price.suk.toLowerCase().includes(searchInput.toLowerCase())
        );
      });
      return temp;
    } catch (e) {
      console.log(e);
      return [];
    }
  }, [searchInput, sortedPrices]);

  useEffect(() => {
    getAllPrices(setIsLoading, setData);
  }, []);
  useEffect(() => {
    if (Object.keys(markedIDS).length === 0) {
      setMarkMode(false);
      setAllMarked(false);
    } else {
      setMarkMode(true);
      if (Object.keys(markedIDS).length === filteredPrices.length) {
        setAllMarked(true);
      } else {
        setAllMarked(false);
      }
    }
  }, [markedIDS, filteredPrices]);
  useEffect(() => {
    markAll(false);
  }, [
    searchInput,
    data,
    filteredPrices,
    firstSortSelectValue,
    modelSelectValue,
    activatedSelectValue,
    categorySelectValue,
    brandSelectValue,
    availabilitySelectValue,
    idSelectValue,
    dateSelectValue,
  ]);

  const markAll = (mark) => {
    if (mark) {
      const temp = {};
      filteredPrices.forEach((item) => {
        temp[item.id] = { marked: mark };
      });
      setMarkedIDS(temp);
    } else {
      setMarkedIDS({});
    }
  };
  const handleMark = (id) => {
    const temp = { ...markedIDS };
    if (temp[id]) {
      delete temp[id];
    } else {
      temp[id] = { marked: true };
    }
    setMarkedIDS(temp);
  };

  const renderSwitch = (param) => {
    switch (param) {
      case "model":
        return (
          <Select
            key={param}
            defaultValue={modelSelectValue}
            onChange={(value) => setModelSortSelectValue(value)}
            isSearchable={false}
            placeholder="Выберите..."
            styles={selectStyle}
            options={whichFirstOptions}
          />
        );
      case "activated":
        return (
          <Select
            key={param}
            defaultValue={activatedSelectValue}
            isSearchable={false}
            placeholder="Выберите..."
            styles={selectStyle}
            options={whichFirstOptionsActivation}
            onChange={(value) => setActivatedSortSelectValue(value)}
          />
        );
      case "category":
        return (
          <AsyncSelect
            defaultValue={categorySelectValue}
            defaultOptions={[{ value: "all", label: "Все" }]}
            onChange={(value) => setCategorySortSelectValue(value)}
            key={param}
            loadOptions={searchCategories}
            placeholder="Выберите..."
            styles={selectStyle}
          />
        );
      case "brand":
        return (
          <AsyncSelect
            defaultValue={brandSelectValue}
            defaultOptions={[{ value: "all", label: "Все" }]}
            onChange={(value) => setBrandSortSelectValue(value)}
            key={param}
            loadOptions={searchBrands}
            placeholder="Выберите..."
            styles={selectStyle}
          />
        );
      case "availability":
        return (
          <Select
            defaultValue={availabilitySelectValue}
            onChange={setAvailabilitySortSelectValue}
            key={param}
            placeholder="Выберите..."
            styles={selectStyle}
            options={availabilityOptions}
          />
        );
      case "date":
        return (
          <Select
            defaultValue={dateSelectValue}
            onChange={setDateSortSelectValue}
            key={param}
            placeholder="Выберите..."
            styles={selectStyle}
            options={whichFirstOptionsDate}
          />
        );
      case "id":
        return (
          <Select
            defaultValue={idSelectValue}
            onChange={setIdSortSelectValue}
            key={param}
            placeholder="Выберите..."
            styles={selectStyle}
            options={whichFirstOptions}
          />
        );
      default:
        return "";
    }
  };

  const _searchBrands = (inputValue, callback) => {
    getBrands(inputValue).then((resp) => callback(resp));
  };
  const _searchCategories = (inputValue, callback) => {
    getCategories(inputValue).then((resp) => callback(resp));
  };
  const searchBrands = debounce(_searchBrands, 800);
  const searchCategories = debounce(_searchCategories, 800);

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
    <div className="PricesContainer">
      <div className={`firstHalf ${mobileEditVisible ? "Hide" : ""}`}>
        <div className="SearchInput">
          <LegendInput
            legend="Поиск"
            type="text"
            value={searchInput}
            setValue={setSearchInput}
            placeholder="Название, бренд и т.п."
          />
        </div>
        <div className="horizontaltwo">
          <div className="checkall">
            <MyCheckBox checked={allMarked} setChecked={(v) => markAll(v)} />
            <p>{allMarked ? "Убрать всё" : "Выбрать всё"}</p>
          </div>
          <div className="sortselect">
            <Select
              defaultValue={firstSortSelectValue}
              options={options}
              isSearchable={false}
              placeholder="Выберите..."
              styles={selectStyle}
              onChange={(value) => setFirstSortSelectValue(value)}
            />
            {renderSwitch(firstSortSelectValue.value)}
          </div>
        </div>
        <div className="ResultSum">
          <p>Всего результатов: {filteredPrices.length}</p>
          <p>Отмечено: {Object.keys(markedIDS).length}</p>
        </div>
        <div className="PricesWrapper">
          {filteredPrices.map((item, index) => {
            return (
              <Price
                setMobileEditVisible={setMobileEditVisible}
                checked={markedIDS[item.id]}
                key={item.id}
                update={() => {
                  getAllPrices(setIsLoading, setData);
                }}
                index={index}
                data={item}
                setChecked={handleMark}
                setEditableId={setEditableId}
              />
            );
          })}
        </div>
        <div className="MarkedControlBtns">
          <MyButton
            isLoading={isChangeLoading}
            onClick={() => {
              if (
                window.confirm(
                  "Вы уверены что хотите активировать все отмеченные прайсы?"
                )
              ) {
                changePriceActivity(setIsChangeLoading, markedIDS, true, () => {
                  getAllPrices(setIsLoading, setData);
                });
              }
            }}
            disabled={!markMode}
          >
            Акт. отмеченные
          </MyButton>
          <MyButton
            isLoading={isChangeLoading}
            onClick={() => {
              if (
                window.confirm(
                  "Вы уверены что хотите деактивировать все отмеченные прайсы?"
                )
              ) {
                changePriceActivity(
                  setIsChangeLoading,
                  markedIDS,
                  false,
                  () => {
                    getAllPrices(setIsLoading, setData);
                  }
                );
              }
            }}
            disabled={!markMode}
          >
            Деакт. отмеченные
          </MyButton>
          <MyButton
            isLoading={isDeleteLoading}
            onClick={() => {
              if (
                window.confirm(
                  "Вы уверены что хотите удалить все отмеченные прайсы?"
                )
              ) {
                deletePrice(setIsDeleteLoading, markedIDS, () => {
                  getAllPrices(setIsLoading, setData);
                });
              }
            }}
            disabled={!markMode}
          >
            Удалить отмеченные
          </MyButton>
        </div>
      </div>
      <div className={`secondHalf ${mobileEditVisible ? "" : "Hide"}`}>
        <EditPage
          setMobileEditVisible={setMobileEditVisible}
          editableId={editableId}
          update={() => {
            getAllPrices(setIsLoading, setData);
          }}
        />
      </div>
    </div>
  );
}

export default PricesPage;
