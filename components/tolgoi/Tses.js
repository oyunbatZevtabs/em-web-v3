import _ from "lodash";
import Link from "next/link";
import React, { useState } from "react";
import { url } from "services/uilchilgee";

function MenuItem({
  mur,
  selected,
  khuudasniiNer,
  setSongogdsonSubMenuteiMenu,
  songogdsonSubMenuteiMenu,
}) {
  const [open, setOpen] = useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  );

  const [khaayaa, setKhaayaa] = useState(false);

  const [popoverVisible, setPopoverVisible] = useState(false);

  const handlePopoverMouseEnter = () => {
    setPopoverVisible(true);
  };

  const handleParentMouseEnter = () => {
    setPopoverVisible(true);
  };

  const handleParentMouseLeave = () => {
    setPopoverVisible(false);
  };

  if (!!mur.sub) {
    return (
      <div className="flex items-center justify-center pt-2">
        <li
          className={`${
            mur?.sub?.some((a) => a.khuudasniiNer === khuudasniiNer)
              ? "selected-menu"
              : "menu-item  duration-500 hover:border-green-300 dark:hover:border-gray-800"
          }`}
          onClick={() => {
            setOpen(!open), setKhaayaa(!khaayaa);
          }}
          onMouseEnter={() => {
            handleParentMouseEnter();
            setSongogdsonSubMenuteiMenu(
              songogdsonSubMenuteiMenu === mur.khuudasniiNer
                ? mur.khuudasniiNer
                : undefined
            );
          }}
          onMouseLeave={() => handleParentMouseLeave()}
        >
          <div
            className="w-full"
            onClick={() => {
              setSongogdsonSubMenuteiMenu(
                songogdsonSubMenuteiMenu === mur.khuudasniiNer
                  ? undefined
                  : mur.khuudasniiNer
              );
            }}
            onMouseEnter={(e) => {
              handlePopoverMouseEnter(e);
            }}
          >
            <div
              className={
                mur?.sub?.some((a) => a.khuudasniiNer === khuudasniiNer)
                  ? "  p-2"
                  : "sub-menu-item w-full  p-2"
              }
            >
              <div className={`flex justify-center`}>
                <div
                  className={
                    selected
                      ? null
                      : `w-fit rounded-[15px] text-[10%] text-[#4FD1C5] dark:text-gray-300`
                  }
                >
                  {mur.icon}
                </div>
              </div>
              <div
                className={`flex w-full items-center justify-center font-[500] text-[#2D3748] dark:text-gray-300`}
              >
                {mur.ner}
              </div>
            </div>
          </div>

          {popoverVisible || songogdsonSubMenuteiMenu === mur.khuudasniiNer ? (
            <div
              style={{
                left: "100%",
                top: "0",
              }}
              className="w-54 absolute z-[999999] block rounded-xl border-[1px] border-[#4FD1C5] bg-white pb-2 dark:border-gray-400 dark:bg-gray-900"
              onMouseEnter={() => {
                handlePopoverMouseEnter();
              }}
            >
              <ul className="block w-full ">
                {mur.sub.map((a) => {
                  return (
                    <Link legacyBehavior href={a.href} key={a.href}>
                      <div
                        onClick={() => setOpen(!open)}
                        className="flex justify-center pt-2"
                      >
                        <li
                          className={
                            a.khuudasniiNer === khuudasniiNer
                              ? "selected-menu-sub-menu"
                              : "sub-menu-content w-auto border border-neutral-50 duration-500 hover:border-green-400 dark:border-gray-900 dark:hover:border-green-600"
                          }
                        >
                          <div className="flex flex-col p-2">
                            <div
                              className={`flex w-full font-[500] text-[#2D3748] dark:text-gray-200`}
                            >
                              {a.ner}
                            </div>
                          </div>
                        </li>
                      </div>
                    </Link>
                  );
                })}
              </ul>
            </div>
          ) : (
            ""
          )}
        </li>
      </div>
    );
  }
  return (
    <Link href={mur.href}>
      <div className="flex items-center justify-center  pt-2">
        <li
          className={
            selected
              ? "selected-menu"
              : "menu-item  duration-500 hover:border-green-300 dark:hover:border-gray-800"
          }
        >
          <div className="flex flex-col p-1 ">
            <div className={`flex justify-center `}>
              <div
                className={
                  selected
                    ? null
                    : `w-fit rounded-[15px]  text-[#4FD1C5] dark:text-gray-300`
                }
              >
                {mur.icon}
              </div>
            </div>
            <div
              className={`flex w-full items-center justify-center font-[500] text-[#2D3748] dark:text-gray-300`}
            >
              {mur.ner}
            </div>
          </div>
        </li>
      </div>
    </Link>
  );
}

function NTses({ khuudasnuud, khuudasniiNer, turul }) {
  const [songogdsonSubMenuteiMenu, setSongogdsonSubMenuteiMenu] = useState();

  return (
    <nav
      style={{ height: "calc(100vh - 70px)" }}
      className="hidden max-w-[120px]  bg-white dark:bg-gray-900 md:flex md:flex-row"
    >
      <ul className="w-[98px]">
        {khuudasnuud.map((mur) => {
          return (
            <MenuItem
              key={mur.href}
              mur={mur}
              selected={mur.khuudasniiNer === khuudasniiNer}
              khuudasniiNer={khuudasniiNer}
              songogdsonSubMenuteiMenu={songogdsonSubMenuteiMenu}
              setSongogdsonSubMenuteiMenu={setSongogdsonSubMenuteiMenu}
            />
          );
        })}
      </ul>
    </nav>
  );
}

export default NTses;
