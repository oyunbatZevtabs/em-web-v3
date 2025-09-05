import { Drawer, Menu, Switch } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { url } from "services/uilchilgee";
import _ from "lodash";

function MenuItem({ mur, selected, khuudasniiNer }) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  );
  if (mur.sub) {
    return (
      <>
        <li
          className={"menu-item flex flex-row"}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-row p-1 ">
            <div className={`mr-3 ${selected ? "text-blue-900" : ""}`}>
              {mur.icon}
            </div>
            {mur.ner}
          </div>
          <div
            className={`transform ${open ? "rotate-180" : ""} ml-auto`}
            style={{ transitionDuration: ".1s" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </li>
        <ul
          className="sub-menu ml-1 mr-4 dark:bg-gray-900"
          style={{ display: open ? "block" : "none" }}
        >
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href}>
                <a
                  onClick={() =>
                    !!localStorage.getItem("ognoo") &&
                    localStorage.removeItem("ognoo")
                  }
                >
                  <li className={`menu-item  dark:bg-gray-900 `}>
                    <div
                      className={
                        a.khuudasniiNer === khuudasniiNer
                          ? "rounded-md bg-gray-200 font-medium text-blue-500"
                          : ""
                      }
                    >
                      <div className="flex flex-row  p-1">
                        <div className={`bg mr-3`}>{a.icon}</div>
                        {/* {t(a.ner)} */}
                      </div>
                    </div>
                  </li>
                </a>
              </Link>
            );
          })}
        </ul>
      </>
    );
  }
  return (
    <Link href={mur.href}>
      <a
        onClick={() =>
          !!localStorage.getItem("ognoo") && localStorage.removeItem("ognoo")
        }
      >
        <li className={selected ? "selected-menu z-0" : "menu-item z-10"}>
          <div className="flex flex-row p-1">
            <div className={`mr-3 ${selected ? "text-blue-900" : ""}`}>
              {mur.icon}
            </div>
            {/* {t(mur.ner)} */}
          </div>
          <span className={selected ? "selected-menu-top" : "hidden"}>
            <span className="absolute h-10 w-10 rounded-br-3xl bg-blue-900 dark:bg-gray-900"></span>
          </span>
          <span className={selected ? "selected-menu-bottom" : "hidden"}>
            <span className="absolute h-10 w-10 rounded-tr-3xl bg-blue-900 dark:bg-gray-900"></span>
          </span>
        </li>
      </a>
    </Link>
  );
}

function MTses({ khuudasnuud, khuudasniiNer, themeValue, setTheme, turul }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mr-2 flex md:hidden">
      <button
        className="border-none outline-none"
        onClick={() => setVisible(!visible)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-align-justify mx-auto block h-8 w-8 "
        >
          <line x1="21" y1="10" x2="3" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="3" y2="18"></line>
        </svg>
      </button>
      <Drawer
        placement={"left"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={"left"}
        bodyStyle={{ padding: "10px 0" }}
        footer={
          <div className="flex h-8 items-center justify-center">
            {/* <div className='mr-4 flex whitespace-nowrap text-gray-700 '>
              Dark Mode
            </div> */}
            {/* <Switch
              checked={themeValue}
              onClick={() => setTheme(themeValue ? "light" : "")}
            /> */}
          </div>
        }
      >
        <ul className="bg-[rgba(22,78,99,0.8)] text-white ">
          <li className="t mb-10 px-2 ">
            <div className="border-b  px-2 pb-2">
              <div className="flex flex-col items-center">
                <img
                  className="h-20 w-20 "
                  alt={"logo"}
                  src={
                    turul === "emch"
                      ? "/Ellipse2.png"
                      : turul === "emiinsan"
                      ? "/monos.png"
                      : "/zev-tabs.png"
                  }
                />
                <div className="font-medium text-gray-100">
                  {turul === "emch"
                    ? "Эмч"
                    : turul === "emiinsan"
                    ? "Эмийн сан"
                    : "Эм"}
                </div>
                {/* <div className='font-medium text-gray-100'></div> */}
              </div>
            </div>
          </li>
          {khuudasnuud.map((mur) => (
            <MenuItem
              key={mur.href}
              mur={mur}
              selected={mur.khuudasniiNer === khuudasniiNer}
              khuudasniiNer={khuudasniiNer}
            />
          ))}
        </ul>
      </Drawer>
    </div>
  );
}

export default MTses;
