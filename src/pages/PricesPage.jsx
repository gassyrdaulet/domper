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
import {
  BsFillCaretLeftSquareFill,
  BsFillCaretRightSquareFill,
} from "react-icons/bs";
import { AiOutlineSync } from "react-icons/ai";
import MyModal from "../components/MyModal";
import Synchronizator from "../components/Synchronizator";
import useAuth from "../hooks/useAuth";

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
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { setIsAuth } = useAuth();

  const [firstSortSelectValue, setFirstSortSelectValue] = useState({
    value: "activated",
    label: "По активности",
  });
  const [modelSelectValue, setModelSortSelectValue] = useState({
    value: 1,
    label: "По возраст.",
  });
  const [activatedSelectValue, setActivatedSortSelectValue] = useState({
    value: "yes",
    label: "Активные",
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
      zIndex: 9,
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

  const paginatedPrices = useMemo(() => {
    try {
      setPageCount(Math.ceil(filteredPrices.length / itemsPerPage));
      const temp = filteredPrices.slice(
        (actualPage - 1) * itemsPerPage,
        (actualPage - 1) * itemsPerPage + itemsPerPage
      );
      return temp;
    } catch (e) {
      console.log(e);

      return [];
    }
  }, [filteredPrices, itemsPerPage, actualPage]);

  const changePage = (newPageNumber) => {
    if (newPageNumber >= 1 && newPageNumber <= pageCount) {
      setActualPage(newPageNumber);
    }
  };

  useEffect(() => {
    getAllPrices(setIsLoading, setData, setIsAuth);
  }, []);
  useEffect(() => {
    if (Object.keys(markedIDS).length === 0) {
      setMarkMode(false);
      setAllMarked(false);
    } else {
      setMarkMode(true);
      if (Object.keys(markedIDS).length === paginatedPrices.length) {
        setAllMarked(true);
      } else {
        setAllMarked(false);
      }
    }
  }, [markedIDS, paginatedPrices]);
  useEffect(() => {
    markAll(false);
  }, [
    searchInput,
    data,
    filteredPrices,
    paginatedPrices,
    firstSortSelectValue,
    modelSelectValue,
    activatedSelectValue,
    categorySelectValue,
    brandSelectValue,
    availabilitySelectValue,
    idSelectValue,
    dateSelectValue,
    actualPage,
    pageCount,
    itemsPerPage,
  ]);
  useEffect(() => {
    setActualPage(1);
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
    pageCount,
    itemsPerPage,
  ]);

  const markAll = (mark) => {
    if (mark) {
      const temp = {};
      paginatedPrices.forEach((item) => {
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
        <MyModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
          <Synchronizator
            close={() => {
              setModalVisible(false);
            }}
            update={() => {
              getAllPrices(setIsLoading, setData, setIsAuth);
            }}
          />
        </MyModal>
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div className="checkall">
              <MyCheckBox checked={allMarked} setChecked={(v) => markAll(v)} />
              <p>{allMarked ? "Убрать всё" : "Выбрать всё"}</p>
            </div>
            <div
              className="checkall"
              onClick={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <AiOutlineSync
                style={{ margintop: "2px", cursor: "pointer" }}
                size={32}
              />
              <p>Синх. с Kaspi</p>
            </div>
          </div>
          <div className="sortselect">
            <Select
              defaultValue={{ value: "activated", label: "По активности" }}
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
          <p>
            Страница: {actualPage} / {pageCount}
          </p>
        </div>
        <div className="Pagination">
          <BsFillCaretLeftSquareFill
            size={25}
            style={{ cursor: "pointer" }}
            onClick={() => {
              changePage(actualPage - 1);
            }}
          />
          <div className="Pages">
            {(() => {
              const pages = [];
              for (let i = 1; i <= pageCount; i++) {
                pages.push(
                  <p
                    onClick={() => setActualPage(i)}
                    className={`PageNumber ${i === actualPage ? "Chosen" : ""}`}
                    key={i}
                  >
                    {i}
                  </p>
                );
              }
              return pages;
            })().map((i) => {
              return i;
            })}
          </div>
          <BsFillCaretRightSquareFill
            size={25}
            style={{ cursor: "pointer" }}
            onClick={() => {
              changePage(actualPage + 1);
            }}
          />
        </div>
        <div className="PricesWrapper">
          {paginatedPrices.map((item, index) => {
            return (
              <Price
                setMobileEditVisible={setMobileEditVisible}
                checked={markedIDS[item.id]}
                key={item.id}
                update={() => {
                  getAllPrices(setIsLoading, setData, setIsAuth);
                }}
                index={index + (actualPage - 1) * itemsPerPage}
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
                  getAllPrices(setIsLoading, setData, setIsAuth);
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
                    getAllPrices(setIsLoading, setData, setIsAuth);
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
                  getAllPrices(setIsLoading, setData, setIsAuth);
                });
              }
            }}
            disabled={!markMode}
          >
            Удалить отмеченные
          </MyButton>
        </div>
      </div>
      <div className={`secondHalf ${mobileEditVisible ? "Show" : "Hide"}`}>
        <EditPage
          setMobileEditVisible={setMobileEditVisible}
          editableId={editableId}
          update={() => {
            getAllPrices(setIsLoading, setData, setIsAuth);
          }}
        />
      </div>
    </div>
  );
}

export default PricesPage;
