import {
  LogoutOutlined,
  QuestionOutlined,
  SettingOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Dropdown,
  Menu,
  Skeleton,
  Tooltip,
  Empty,
  Drawer,
  Button,
  Switch,
} from "antd";
import Link from "next/link";
import React, { useState } from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import { useRouter } from "next/router";
import Tuslamj from "./tuslamj";
import { Modal } from "components/ant/AntdModal";
import Admin from "components/Admin";
import { useAuth } from "services/auth";
import Tokhirgoo from "pages/khyanalt/tokhirgoo";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AsuulgaModal from "components/modalBody/asuulgaModal";
import { useThemeValue } from "pages";
import KhonogTsagKharuulakh from "./KhonogTsagKharuulakh";
// import { useTheme } from "next-themes";
// import { useThemeValue } from "pages";

function ProfileTovch({ ajiltan, garya, token }) {
  const router = useRouter();
  const [showTuslamj, setShowTuslamj] = useState(false);
  const [tokhirgooModal, setTokhirgooModal] = useState(false);
  const [asuukhEsekh, setAsuukhEsekh] = useState(false);
  const { setTheme, themeValue } = useThemeValue();

  function sonorduulgaKharlaa(id, mur) {
    uilchilgee(token)
      .post("/sonorduulgaKharlaa", { id, sonorduulgaId: mur._id })
      .then(() => {
        sonorduulgaMutate();
        if (!!mur?.object?.khariltsagchiinNer)
          router.push("/khyanalt/geree/gereeBurtgel");
        else router.push("/khyanalt/khariltsagchBurtgel");
      })
      .catch(aldaaBarigch);
  }

  function onScroll(e) {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      !!sonorduulga &&
      sonorduulga?.jagsaalt.length === 20
    ) {
      setKhuudaslalt((kh) => ({
        khuudasniiDugaar: kh.khuudasniiDugaar + 1,
        khuudasniiKhemjee: 20,
        jagsaalt: [...kh.jagsaalt, ...sonorduulga?.jagsaalt],
      }));
    }
  }

  function huwiinMedeelelKhadgalakh() {
    const { zurag, shineNuutsUg, shineNuutsUgDavtan, ...ajiltanObject } = state;
    if (shineNuutsUg === shineNuutsUgDavtan)
      ajiltanObject.nuutsUg = shineNuutsUg;

    updateMethod("ajiltan/ajiltan", token, ajiltanObject).then(
      ({ data, status }) => {
        if (status === 200 && "Amjilttai" === data) {
          AmjilttaiAlert("Амжилттай заслаа");
          ajiltanMutate({ ...ajiltanObject });
        }
      }
    );
  }

  function tokhirgooModalNeeyaa() {
    setTokhirgooModal(true);
  }

  function tokhirgooKhadgalyaa() {
    setTokhirgooModal(false);
  }

  const [neelttei, setNeelttei] = useState(false);

  function modalNeekhFunction() {
    setTokhirgooModal(true);
  }

  function tokhirgooModalKhaayaa() {
    if (asuukhEsekh === true) {
      setNeelttei(true);
    } else {
      // setImageUrl();
      setTokhirgooModal(false);
    }
  }

  const tiim = () => {
    setTokhirgooModal(false);
    setNeelttei(false);
    setAsuukhEsekh(false);
    // form.resetFields();
  };
  const ugui = () => {
    setNeelttei(false);
    setAsuukhEsekh(true);
    // form.resetFields();
    // setImageUrl([]);
    setTokhirgooModal(true);
  };

  return (
    <div className="flex h-full items-center justify-end gap-3 ">
      <div className="flex ">
        <div className="mr-4 hidden whitespace-nowrap text-gray-700 dark:text-gray-300 lg:flex">
          Dark Mode
        </div>
        <Switch
          className="bg-green-500"
          checked={themeValue}
          checkedChildren={
            <svg className="" focusable="false" viewBox="0 0 24 24">
              <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path>
            </svg>
          }
          unCheckedChildren={
            <svg className="" focusable="false" viewBox="0 0 24 24">
              <path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path>
            </svg>
          }
          onClick={() => setTheme(themeValue ? "light" : "dark")}
        />
      </div>

      <Dropdown
        overlayClassName="profile dark:border-[#4FD1C5] dark:border-2 dark:bg-gray-900"
        overlay={
          <Menu>
            <Menu.Item className="profileMenuItem ">
              <div className="text-lg font-medium text-white">
                {`${(ajiltan?.ovog && ajiltan?.ovog[0]) || ""}.${ajiltan?.ner}`}
              </div>
              <div className="text-sm font-medium text-gray-200">
                {ajiltan?.albanTushaal}
              </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={tokhirgooModalNeeyaa}
              key="0"
              className="profileMenuItem"
            >
              <div>
                <div className="flex w-44 items-center space-x-2 text-white ">
                  <SettingOutlined />
                  <span>Тохиргоо</span>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              key="1"
              className="profileMenuItem"
              onClick={() => setShowTuslamj(true)}
            >
              <div className="flex w-44 items-center space-x-2 text-white">
                <QuestionOutlined />
                <span>Тусламж</span>
              </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" onClick={garya} className="profileMenuItem">
              <div className="flex w-44 items-center space-x-2 text-white">
                <LogoutOutlined />
                <span>Гарах</span>
              </div>
            </Menu.Item>
          </Menu>
        }
        trigger="click"
        className="cursor-pointer "
      >
        <div className="flex gap-2 dark:text-gray-300">
          <div className="flex w-[150px] flex-col justify-center">
            <div className="items-right flex justify-end text-end text-[14px] font-semibold leading-[18.75px] text-[#293050] dark:text-gray-300">
              {ajiltan?.ner}
            </div>
            <div className="items-right flex justify-end text-end text-[14px] font-semibold leading-[18.75px] text-[#293050] dark:text-gray-300">
              Кассын ажилтан
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <button className="flex h-[48px] w-[48px] items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              <img
                alt={ajiltan?.ner}
                src={
                  ajiltan?.zurgiinNer
                    ? `${url}/ajiltniiZuragAvya/${ajiltan?.zurgiinNer}`
                    : "/profile.svg"
                }
                className="h-[48px] w-[48px] rounded-full bg-gray-200 p-1 shadow-xl"
              />
            </button>
          </div>
        </div>
      </Dropdown>

      <Modal
        footer={false}
        onCancel={() => setNeelttei(false)}
        open={neelttei}
        className="flex min-w-[60%] items-center justify-center"
      >
        <div>
          <AsuulgaModal ugui={ugui} tiim={tiim} type="ankhaar" />
        </div>
      </Modal>

      <Modal
        okText={"Хадгалах"}
        footer={false}
        title="Тохиргоо"
        open={tokhirgooModal}
        destroyOnClose={true}
        onCancel={tokhirgooModalKhaayaa}
        width={1300}
      >
        <Tokhirgoo
          setAsuukhEsekh={setAsuukhEsekh}
          tokhirgooModalKhaayaa={tokhirgooModalKhaayaa}
          setTokhirgooModal={setTokhirgooModal}
        />
      </Modal>
    </div>
  );
}

export default ProfileTovch;
