import { Input, Checkbox, Popover, Select } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import moment from "moment";
import {
  CalendarOutlined,
  CheckOutlined,
  LeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAuth, useBaiguullagiinId } from "../services/auth";
import NTses from "./tolgoi/Tses";
import _ from "lodash";

import ProfileTovch from "./tolgoi/ProfileTovch";
import useErkh from "../tools/logic/khereglegchiinErkhiinTokhirgoo";
// import { useThemeValue } from "pages/index";
import Updater from "./Updater";
import DelgetsKhuleegdekhUe from "./delgetsKhuleegdekhUe";
import KhonogTsagKharuulakh from "./tolgoi/KhonogTsagKharuulakh";
import useData from "hooks/useData";
import { setCookie } from "nookies";
import { Button } from "./ant/AntdButton";
import { Modal } from "./ant/AntdModal";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import AmjilttaiAlert from "./alert/AmjilttaiAlert";
import Snowfall from "react-snowfall";
// import { Select } from "./ant/AntdSelect";

var timeout = null;

function Admin({
  title,
  khuudasniiNer,
  onSearch,
  children,
  className,
  dedKhuudas,
  hideSearch,
  onBack,
  tsonkhniiId,
  header,
  loading,
  setSearchValue,
  searchValue,
}) {
  const [mSearch, setMSearch] = useState(false);
  const [selectedOption, setSelectedOption] = useState("2");

  const router = useRouter();
  const { Option } = Select;

  const {
    ajiltan,
    token,
    garya,
    ajiltniiJagsaalt,
    ajiltanNemya,
    setToken,
    ajiltanKhasya,
    barilgaSoliyo,
    baiguullagiinId,
    setBaiguullagiinId,
    setSalbariinId,
    salbariinId,
  } = useAuth();
  const khuudasnuud = useErkh(ajiltan);

  function onClickSearch() {
    if (mSearch) {
      const search = document.getElementById("search");
      document.getElementById("mobileSearch").classList.remove("hidden");
      search.classList.add("hidden");
      document.getElementById("garchig").classList.remove("hidden");
      search.getElementsByTagName("input")[0].value = "";
      onSearch && onSearch("");
    } else {
      document.getElementById("mobileSearch").classList.add("hidden");
      document.getElementById("search").classList.remove("hidden");
    }

    setMSearch(!mSearch);
  }

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    setSalbariinId(value);
    setCookie(null, "salbariinId", value, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  };

  const { data: emiinSanData } = useData(
    token,
    baiguullagiinId && "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  const onChange = (e) => {
    setUstgahdaaItgelteiBaina(e.target.checked);
  };

  const [openModal, setOpenmodal] = useState(false);
  const [ustgahdaaItgelteiBaina, setUstgahdaaItgelteiBaina] = useState(false);

  // const аааааааaaaaaаa = () => {
  //   if (ustgahdaaItgelteiBaina) {
  //     posUilchilgee(token)
  //       .post("/nuutsTovchoorUgugdulUstgay")
  //       .then(({ data, status }) => {
  //         if (!!data) {
  //           AmjilttaiAlert("Устцөөн refresh хийгээрэй");
  //           setOpenmodal(false);
  //         }
  //       })
  //       .catch((e) => {
  //         aldaaBarigch(e);
  //       });
  //   } else {
  //     AnkhaaruulgaAlert("Итгэлгүй биш байгаа бол устгахгуааааа");
  //   }
  // };
  const images = [];
  if (typeof window !== "undefined") {
    const snowflake3 = document.createElement("img");
    snowflake3.src = "/snowflake3.png";
    images.push(snowflake3);
  }

  // const adminEsekh = emiinSanData?.map((option) =>
  //   ajiltan?.salbaruud.find((a) => a === option._id)
  // );

  // console.log(adminEsekh, "emiinSanDataemiinSanData");

  return (
    <div className="flex h-screen w-screen flex-row bg-slate-50 dark:bg-gray-900 ">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/zev-tabs.png" />
      </Head>
      <Updater />
      {moment(new Date()).format("MM") === "12" ? (
        <Snowfall radius={[10, 30]} snowflakeCount={200} images={images} />
      ) : null}
      <div className="w-full bg-slate-50 dark:bg-gray-800 dark:text-gray-300">
        <div className="flex h-[60px] w-full flex-row justify-center border-b bg-white pl-0 dark:bg-gray-900 xl:h-[70px] xl:justify-end">
          <div className="flex w-[115px] items-center justify-center ">
            <img
              src="/logo.png"
              width={50}
              height={50}
              className="object-contain"
              alt="logo"
            />
          </div>
          {moment(new Date()).format("MM") === "12" ? (
            <Popover
              content={<div>Шинэ оны мэнд хүргэе{"<3"}</div>}
              placement={"right"}
            >
              <img
                src="/2024-Year-PNG.png"
                className="ml-10 object-contain"
                alt="logo"
              />
            </Popover>
          ) : null}

          <div className="flex">
            {dedKhuudas && (
              <button
                type="primary"
                className="iconbutton flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={() =>
                  _.isFunction(onBack) ? onBack(router.back) : router.back()
                }
              >
                <LeftOutlined
                  style={{ fontSize: "10px" }}
                  className="flex items-center justify-center "
                />
              </button>
            )}
          </div>
          <div className="flex w-[100%] flex-row justify-between gap-2 p-2 sm:space-x-6">
            <div className=" flex w-max items-center text-center text-lg font-semibold text-[#2D3748] dark:text-gray-50 xl:text-2xl">
              {title}
            </div>
            <div className="flex gap-3">
              {!hideSearch && (
                <>
                  <div
                    id="search"
                    className="flex w-full items-center justify-evenly gap-4 text-gray-800 dark:text-gray-300  sm:relative xl:gap-11"
                  >
                    {setSearchValue ? (
                      <Input
                        className=" !h-[30px] !w-[150px] placeholder-[#293050]  dark:placeholder-gray-50 dark:placeholder:text-transparent xl:!h-[48px]  xl:!w-[200px]"
                        value={searchValue}
                        prefix={<SearchOutlined className="text-[18px]" />}
                        style={{
                          borderRadius: "25px",
                          // width: "100%",
                          maxWidth: "264px",
                          height: "48px",
                          borderColor: "#4FD1C5",
                        }}
                        onChange={({ target }) => {
                          !!setSearchValue && setSearchValue(target.value);
                          if (!!onSearch) {
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                              onSearch(target.value);
                            }, 1000);
                          }
                        }}
                        placeholder="Хайлт..."
                      />
                    ) : (
                        <Input
                        className="header !h-[30px] !w-[150px]  placeholder-[#293050] dark:placeholder:focus:text-transparent xl:!h-[48px] xl:!w-[200px]"
                        prefix={<SearchOutlined className="text-[18px] " />}
                        style={{
                          borderRadius: "25px",
                          // width: "100%",
                          maxWidth: "264px",
                          // height: "48px",
                          borderColor: "#4FD1C5",
                        }}
                        onChange={({ target }) => {
                          if (!!onSearch) {
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                              onSearch(target.value);
                            }, 300);
                          }
                        }}
                        placeholder="Хайлт..."
                      />
                    )}
                    <div className="flex h-[28px] gap-5 xl:h-[48px]">
                      <Select
                        bordered={false}
                        className="flex h-full w-[150px]  border-[1px] border-[#4FD1C5] bg-white  xl:!w-[200px]"
                        size="large"
                        style={{
                          borderRadius: "20px",
                          fontSize: 14,
                        }}
                        placeholder="Салбар"
                        value={salbariinId}
                        onChange={(v) => handleSelectChange(v)}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                      >
                        {emiinSanData?.map(
                          (option) =>
                            (ajiltan?.salbaruud.find((a) => a === option._id) ||
                              ajiltan?.AdminEsekh) && (
                              <Option
                                className={`mx-2 my-1 rounded-[10px] border-[1px] border-[#4FD1C5] p-4 font-semibold dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:active:bg-gray-800  ${
                                  option?._id === salbariinId
                                    ? "selected-option"
                                    : ""
                                }`}
                                key={option?._id}
                                value={option?._id}
                              >
                                <div className="flex  !items-center justify-between px-2 !text-center  font-semibold ">
                                  {option?.ner}
                                </div>
                                <div
                                  className={`songgogdsonV first-letter: !flex h-[17px] w-[17px] items-center justify-center rounded-full border-[1px] border-[#4FD1C5] dark:text-gray-300 ${
                                    option?._id === salbariinId &&
                                    "bg-[#4FD1C5] dark:bg-gray-800 "
                                  }`}
                                >
                                  {option?._id === salbariinId && (
                                    <CheckOutlined
                                      style={{ color: "white" }}
                                      className="text-[8px]"
                                    />
                                  )}
                                </div>
                              </Option>
                            )
                        )}
                      </Select>
                      {/* <div className="hidden w-[150px] items-center justify-center gap-2 xl:flex">
                        <CalendarOutlined className="text-[18px]" />
                        <div className="font-semibold text-[#293050] dark:text-gray-300">
                          <KhonogTsagKharuulakh />
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <ProfileTovch ajiltan={ajiltan} garya={garya} token={token} />
                </>
              )}
            </div>
          </div>
        </div>
        {/* <div className="flex h-[88px] w-full flex-row justify-center border-b bg-white p-2 pl-0 dark:bg-gray-900 xl:justify-end">
          <div className="flex w-[115px] items-center justify-center ">
            <img
              src="/logo.png"
              width={50}
              height={50}
              className="object-contain"
              alt="logo"
            />
          </div>

          <div className="flex w-[100%] flex-row justify-between gap-2 p-2 sm:space-x-6">
            <div className=" flex w-max items-center text-center text-2xl font-semibold text-[#2D3748] dark:text-gray-50">
              {title}
            </div>
            <div className="flex gap-3">
              {!hideSearch && (
                <>
                  <div
                    id="search"
                    className="flex w-full justify-evenly gap-11 text-gray-800   dark:text-gray-300 sm:relative">
                    {setSearchValue ? (
                      <Input
                        className="placeholder-[#293050] dark:placeholder-gray-50  dark:placeholder:text-transparent"
                        value={searchValue}
                        prefix={<SearchOutlined className="text-[18px]" />}
                        style={{
                          borderRadius: "25px",
                          width: "100%",
                          maxWidth: "264px",
                          height: "48px",
                          borderColor: "#4FD1C5",
                        }}
                        onChange={({ target }) => {
                          !!setSearchValue && setSearchValue(target.value);
                          if (!!onSearch) {
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                              onSearch(target.value);
                            }, 1000);
                          }
                        }}
                        placeholder="Хайлт..."
                      />
                    ) : (
                      <Input
                        className="placeholder-[#293050] dark:placeholder:focus:text-transparent"
                        prefix={<SearchOutlined className="text-[18px] " />}
                        style={{
                          borderRadius: "25px",
                          width: "100%",
                          maxWidth: "264px",
                          height: "48px",
                          borderColor: "#4FD1C5",
                        }}
                        onChange={({ target }) => {
                          if (!!onSearch) {
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                              onSearch(target.value);
                            }, 300);
                          }
                        }}
                        placeholder="Хайлт..."
                      />
                    )}
                    <div className="flex gap-5">
                      <Select
                        bordered={false}
                        className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                        size="large"
                        height={"48px"}
                        style={{
                          paddingTop: "3px",
                          width: 200,
                          height: "48px",
                          borderRadius: "25px",
                          fontSize: 14,
                        }}
                        placeholder="Салбар"
                        value={salbariinId}
                        onChange={(v) => handleSelectChange(v)}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }>
                        {emiinSanData?.map(
                          (option) =>
                            (ajiltan?.salbaruud.find((a) => a === option._id) ||
                              ajiltan?.AdminEsekh) && (
                              <Option
                                className={`mx-2 my-1 rounded-[10px] border-[1px] border-[#4FD1C5] p-4 font-semibold dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600  ${
                                  option?._id === salbariinId
                                    ? "selected-option"
                                    : ""
                                }`}
                                key={option?._id}
                                value={option?._id}>
                                <div className="flex !items-center justify-between px-2 !text-center font-semibold ">
                                  {option?.ner}
                                </div>
                                <div
                                  className={`songgogdsonV first-letter: !flex h-[17px] w-[17px] items-center justify-center rounded-full border-[1px] border-[#4FD1C5] dark:text-gray-300 ${
                                    option?._id === salbariinId &&
                                    "bg-[#4FD1C5] dark:bg-gray-800 "
                                  }`}>
                                  {option?._id === salbariinId && (
                                    <CheckOutlined
                                      style={{ color: "white" }}
                                      className="text-[8px]"
                                    />
                                  )}
                                </div>
                              </Option>
                            )
                        )}
                      </Select>
                    </div>
                  </div>
                  <ProfileTovch ajiltan={ajiltan} garya={garya} token={token} />
                </>
              )}
            </div>
          </div>
        </div> */}
        <div style={{ height: "calc(100vh - 90px)" }} className="relative flex">
          <div>
            {!dedKhuudas && (
              <NTses
                khuudasnuud={khuudasnuud}
                khuudasniiNer={khuudasniiNer}
                ajiltan={ajiltan}
                ajiltniiJagsaalt={ajiltniiJagsaalt}
                ajiltanNemya={ajiltanNemya}
                setToken={setToken}
                ajiltanKhasya={ajiltanKhasya}
                barilgaSoliyo={barilgaSoliyo}
              />
            )}
          </div>
          {/* <div className="h-[100px] w-[800px] border border-black">
            <div className=" z-[999999] h-full w-[120px] overflow-x-visible overflow-y-scroll border border-amber-500">
              <div className="absolute z-[99999] w-[240px]">
                ewqeqweqweqw ewqe 1
              </div>
              <div className="absolute z-[99999] w-[240px]">
                ewqeqweqweqw ewqe 2
              </div>
              <div className="absolute z-[99999] w-[240px]">
                ewqeqweqweqw ewqe 3
              </div>
              <div className="absolute z-[99999] w-[240px]">
                ewqeqweqweqw ewqe 4
              </div>
              <div className="absolute z-[99999] w-[240px]">
                ewqeqweqweqw ewqe 5
              </div>
              <div className="absolute z-[99999] w-[240px]">
                ewqeqweqweqw ewqe 6
              </div>
              <div className="absolute z-[99999] w-[240px]">
                ewqeqweqweqw ewqe 7
              </div>
            </div>
            <div></div>
          </div> */}
          <div className={`md:rounded-3xl   ${dedKhuudas ? "w-full" : "main"}`}>
            <div
              className={`grid h-[calc(100vh-90px)] grid-cols-12 gap-6  ${className}`}
            >
              {loading && <DelgetsKhuleegdekhUe />}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Admin;
