import { Button, Checkbox, Form, Input, message, Image } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useState } from "react";
import posUilchilgee, { aldaaBarigch, posUrl } from "services/posUilchilgee";
import { useAuth } from "services/auth";
import useBaraa from "hooks/useBaraa";
import formatNumber from "tools/function/formatNumber";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import moment from "moment";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import { Popover } from "components/ant/AntdPopover";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import { BsBoxSeam } from "react-icons/bs";

const order = { createdAt: -1 };

function OrluulakhEmSongokh({}) {
  const { token, baiguullagiinId, salbariinId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCancel() {
    setIsModalOpen(false);
  }

  function handleOpen() {
    setIsModalOpen(true);
  }

  useKeyboardTovchlol("F2", f2Darsan);
  function f2Darsan() {
    handleOpen();
  }

  const orluulakhEmnuudQuery = useMemo(() => {
    // if (!!hynaltiinDugaaraarLavlagaaAvakhData) {
    return {
      emdOrluulakh: {
        $in: true,
      },
    };
    // }
  }, [isModalOpen]);

  const { baraaGaralt: orluulakhEm } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    orluulakhEmnuudQuery,
    order
  );

  function hadgalahFunction() {
    setSongogdsomEmnuud(shineSongogdsomEmnuud);
    setIsModalOpen(false);
    if (songogdsomEmnuud?.length === 0 && shineerBarimtiinDugaarAviya) {
      posUilchilgee(token)
        .post("/zakhialgiinDugaarAvya", {
          baiguullagiinId: baiguullagiinId,
        })
        .then(({ data }) => {
          if (data) {
            setGuilgeeniiDugaar(data);
            setShineerBarimtiinDugaarAviya(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    }
  }

  return (
    <>
      <button
        type="primary"
        className=" flex h-12 w-full items-center justify-center rounded-2xl border border-[#4FD1C5] text-xl font-[600] shadow-md xl:h-12"
        onClick={() => handleOpen()}>
        <div className="truncate p-2 text-[15px] xl:text-[15px]">
          Орлуулах эм
        </div>
      </button>
      <Modal
        bodyStyle={{ padding: "0" }}
        destroyOnClose={true}
        width={"738px"}
        okText="Хайх"
        footer={
          <div className="flex w-full justify-end">
            {/* {!!hynaltiinDugaaraarLavlagaaAvakhData && ( */}
            <Button
              // onClick={() => {
              //   setHynaltiinDugaaraarLavlagaaAvakhData();
              // }}
              style={{ width: "126px", height: "36px" }}
              type="">
              Цэвэрлэх
            </Button>
            {/* )} */}
            {/* {!!hynaltiinDugaaraarLavlagaaAvakhData && ( */}
            <Button
              // onClick={hadgalahFunction}
              style={{ width: "126px", height: "36px" }}
              type="primary">
              Захиалах
            </Button>
            {/* )} */}
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Оруулах эм
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="text text-center">
          {orluulakhEm?.jagsaat?.length !== 0 ? (
            <div
              className="flex max-h-[70vh] flex-wrap justify-center gap-3 overflow-scroll p-2 xl:max-h-[80vh]"
              onScroll={(e) => {
                if (
                  e.target.scrollHeight - e.target.scrollTop - 2 <=
                  e.target.clientHeight
                ) {
                  next();
                }
              }}>
              {orluulakhEm?.jagsaalt?.map((mur, index) => {
                return (
                  <Popover
                    key={index}
                    content={
                      <div className="flex flex-col">
                        {mur.code && (
                          <div className="flex gap-[5px] font-semibold">
                            <div>Барааны нэр:</div>
                            <div>{mur.ner}</div>
                          </div>
                        )}
                        {mur.code && (
                          <div className="flex gap-[5px] font-semibold">
                            <div>Дотоод код:</div>
                            <div>{mur.code}</div>
                          </div>
                        )}
                        {mur.barCode && (
                          <div className="flex gap-[5px] font-semibold">
                            <div>Бар код:</div>
                            <div>{mur.barCode}</div>
                          </div>
                        )}
                        <div className="flex gap-[5px] font-semibold">
                          <div>Үлдэгдэл:</div>
                          <div>
                            {mur.uldegdel}{" "}
                            {mur.shirkheglekhEsekh ? "хайрцаг" : "ш"}
                          </div>
                        </div>
                        {mur.shirkheglekhEsekh && (
                          <div className="flex gap-[5px] font-semibold">
                            <div>Нэг хайрцаг дахь ширхэг:</div>
                            <div>{mur.negKhairtsaganDahiShirhegiinToo}ш</div>
                          </div>
                        )}
                        {mur.uramshuulal?.length > 0 && (
                          <div>
                            <div className="text-center font-semibold">
                              Урамшуулал{" "}
                            </div>
                          </div>
                        )}
                      </div>
                    }
                    title={false}>
                    <>
                      <div
                        className={
                          "relative flex h-[105px] w-[120px] cursor-pointer flex-col rounded-2xl border border-[#4FD1C5] shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 dark:border-[#4FD1C5] dark:bg-gray-800 xl:h-[145px] xl:w-[160px] "
                        }
                        // onClick={() => {}}
                      >
                        <div className="relative flex h-[90%] w-full items-center justify-center overflow-hidden pb-[14px] pt-5">
                          <Image
                            layout="responsive"
                            objectfit=""
                            preview={false}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            src={
                              !!mur.zurgiinId
                                ? `${posUrl}/file?path=baraa/${mur?.zurgiinId}`
                                : "/drugs.svg"
                            }
                            width={"85%"}
                            height={"85%"}
                          />
                          <div className="absolute top-0 flex w-full justify-between px-[3px]">
                            <Popover
                              content={
                                <div className="flex flex-col gap-2">
                                  <div className="text-[16px] text-black">
                                    {tooOronKhyazgaarliy(mur.uldegdel || 0, 2)}{" "}
                                    ш
                                  </div>
                                </div>
                              }>
                              <div className="ml-[10px] flex h-[20px] w-[66px] max-w-[4rem] items-center justify-center gap-[4px] truncate rounded-b-[10px] bg-white text-[8px] font-bold text-[#293050] dark:bg-gray-800 dark:text-gray-300 xl:text-[12px]">
                                <BsBoxSeam className="text-[#4FD1C5]" />{" "}
                                <div>
                                  {tooOronKhyazgaarliy(mur.uldegdel || 0, 2)} ш
                                </div>
                              </div>
                            </Popover>
                            <Popover
                              content={
                                <div>{formatNumber(mur.niitUne || 0, 2)}₮</div>
                              }>
                              <div className="mr-[10px] flex h-[20px] w-[66px] max-w-[4rem] items-center justify-center truncate rounded-b-[10px] bg-[#4FD1C5] p-2 text-center text-[8px] font-bold dark:bg-gray-900 xl:text-[12px]">
                                {formatNumber(mur.niitUne || 0, 2)}
                                {"₮"}
                              </div>
                            </Popover>
                          </div>
                          <Popover
                            content={<div>{mur.barCode || mur.code}</div>}>
                            <div className="absolute bottom-0 h-[14px] w-[118px] truncate rounded-t-[15px] border-[1px] border-[#4FD1C5] bg-white px-2 text-center text-[10px] dark:bg-gray-900 ">
                              {mur.barCode || mur.code}
                            </div>
                          </Popover>
                        </div>
                        <div className="flex h-[fit] flex-col truncate border-t-[1px] border-[#4FD1C5] px-2 ">
                          <div className=" flex h-full items-center justify-start truncate break-all text-left text-[10px] font-[600] leading-4 xl:text-[16px]">
                            {mur?.boginoNer ? mur?.boginoNer : mur?.ner}
                          </div>
                        </div>
                      </div>
                    </>
                  </Popover>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div>
                <FaCartArrowDown
                  style={{ color: "rgba(41, 48, 80, 0.3)" }}
                  className="text-[90px]"
                />
              </div>
              <div
                className="font-normal"
                style={{ color: "rgba(41, 48, 80, 0.5)" }}>
                Бараа байхгүй байна
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
export default OrluulakhEmSongokh;
