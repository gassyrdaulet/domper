import { useEffect, useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./styles.css";
import {
  BsPlusSquare,
  BsBoxSeam,
  BsFillFileEarmarkCodeFill,
  BsWallet2,
  BsQuestionCircle,
  BsGearWideConnected,
  BsBoxArrowLeft,
  BsList,
  BsPower,
} from "react-icons/bs";
import { logout, getUserInfo, changeActivation } from "../api/AuthService";
import useAuth from "../hooks/useAuth";
import { useOutsideAlerter } from "../hooks/useOutsideAlerter";
import Loading from "../UI/Loading";
import NewPrice from "./NewPrice";
import PricesPage from "./PricesPage";
import XMLview from "./XMLview";
import SettingsPage from "./SettingsPage";
import SubscriptionsPage from "./SubscriptionsPage";
import HelpPage from "./HelpPage";

const tabArr = [
  { title: "Новый товар", icon: <BsPlusSquare />, page: <NewPrice /> },
  { title: "Все товары", icon: <BsBoxSeam />, page: <PricesPage /> },
  {
    title: "Посмотреть XML",
    icon: <BsFillFileEarmarkCodeFill />,
    page: <XMLview />,
  },
  { title: "Настройки", icon: <BsGearWideConnected />, page: <SettingsPage /> },
  { title: "Подписка", icon: <BsWallet2 />, page: <SubscriptionsPage /> },
  { title: "Помощь и FAQ", icon: <BsQuestionCircle />, page: <HelpPage /> },
];

function MainPage() {
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isActivatedLoading, setIsActivatedLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const menuWrapper = useRef(null);
  const { setIsAuth } = useAuth();

  useOutsideAlerter(menuWrapper, setMobileMenuActive);
  useEffect(() => {
    getUserInfo(setIsProfileLoading, setProfileData);
  }, []);

  return (
    <div>
      <div className="MenuButton">
        <BsList
          size={40}
          style={{ cursor: "pointer" }}
          onClick={() => setMobileMenuActive(!mobileMenuActive)}
        />
      </div>
      <Tabs
        onSelect={() => {
          setMobileMenuActive(false);
        }}
        defaultIndex={1}
        className="Tabs"
        selectedTabClassName="SelectedTab"
        disabledTabClassName="DisabledTab"
        selectedTabPanelClassName="TabPanel"
      >
        <div
          ref={menuWrapper}
          className={
            "MenuWrapper " + (mobileMenuActive ? "MenuWrapperActive" : "")
          }
        >
          {isProfileLoading ? (
            <div className="Profile">
              <Loading which={0} />
            </div>
          ) : (
            <div className="Profile">
              <p>{profileData.username}</p>
              <p>{profileData.store_name}</p>
              <p>{profileData.store_id}</p>
              <div style={{ flex: 1, flexDirection: "row" }}>
                <BsBoxArrowLeft
                  size={23}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Вы действительно хотите выйти из своего аккаунта?"
                      )
                    ) {
                      logout(setIsProfileLoading, setIsAuth);
                    }
                  }}
                />
                <BsPower
                  size={23}
                  color={profileData.activated ? "#1DE81C" : "red"}
                  style={{ cursor: "pointer", marginLeft: 10 }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Вы действительно хотите выйти из своего аккаунта?"
                      )
                    ) {
                      changeActivation(setIsActivatedLoading, () => {
                        getUserInfo(setIsProfileLoading, setProfileData);
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}
          <TabList className="TabList">
            {tabArr.map((item) => {
              return (
                <Tab key={item.title}>
                  <div className="IconWrapper">{item.icon}</div>
                  <p>{item.title}</p>
                </Tab>
              );
            })}
          </TabList>
        </div>
        {tabArr.map((item) => {
          return (
            <TabPanel key={item.title}>
              <h2 className="PanelTitle">{item.title}</h2>
              {item.page}
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}

export default MainPage;
