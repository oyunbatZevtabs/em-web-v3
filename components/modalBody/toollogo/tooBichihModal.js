import { Button, DatePicker } from "antd";
import locale from "antd/lib/date-picker/locale/mn_MN";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { Modal } from "components/ant/AntdModal";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import formatNumber from "tools/function/formatNumber";
import { CiEdit } from "react-icons/ci";
import TooShirkhegInput from "components/ant/AntdInput";
import TsuvralOruulakhModal from "./tsuvralOruulakhModal";
import MushgiltOruulakhModal from "./mushgiltOruulakhModal";
import TsuvralBolonMushgiltOruulakhModal from "./tsuvralBolonMushgiltOruulakhModal";

function TooBichihModal({
  ekhelsenToollogo,
  data,
  salbariinId,
  baiguullagiinId,
  ekhelsenToollogoMutate,
  toolsonToo,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();
  const [too, setToo] = useState();
  const [baraaniiTsuvraluud, setBaraaniiTsuvraluud] = useState();
  const inputRef = useRef();


  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
    }
  }, [isModalOpen]);

  function addInputValue(value, dugaar) {
    const updatedTsuwraliinDugaar = [...baraaniiTsuvraluud];

    const itemIndex = updatedTsuwraliinDugaar.findIndex(
      (item) => item.dugaar === dugaar
    );

    if (itemIndex !== -1) {
      updatedTsuwraliinDugaar[itemIndex].toolsonToo = value;

      setToo(
        updatedTsuwraliinDugaar.reduce((a, b) => a + (b.toolsonToo || 0), 0)
      );

      setBaraaniiTsuvraluud(updatedTsuwraliinDugaar);
    }
  }

  function addInputValueOgnoo(value, duusakhOgnoo) {
    const updatedTsuwraliinDugaar = [...baraaniiTsuvraluud];

    const itemIndex = updatedTsuwraliinDugaar.findIndex(
      (item) => item.duusakhOgnoo === duusakhOgnoo
    );

    if (itemIndex !== -1) {
      updatedTsuwraliinDugaar[itemIndex].toolsonToo = value;

      setToo(
        updatedTsuwraliinDugaar.reduce((a, b) => a + (b.toolsonToo || 0), 0)
      );

      setBaraaniiTsuvraluud(updatedTsuwraliinDugaar);
    }
  }

  const openModal = () => {
    if (
      (data.ognooniiMedeelelBurtgekhEsekh === true &&
        data.tsuvral.length === 0) ||
      (data.tsuvraliinDugaartaiEsekh === true && data.tsuvral.length === 0) ||
      (data.tsuvraliinDugaartaiEsekh === true &&
        data.ognooniiMedeelelBurtgekhEsekh === true &&
        data.tsuvral.length === 0)
    ) {
      var yavuulakhData = {
        duusakhOgnoo: ekhelsenToollogo?.duusakhOgnoo,
        ekhlekhOgnoo: ekhelsenToollogo?.ekhlekhOgnoo,
        salbariinId: salbariinId,
        baiguullagiinId: baiguullagiinId,
        code: data.code,
      };
      posUilchilgee(token)
        .post("/baraaniiTsuvralAvya", yavuulakhData)
        .then(({ data, status }) => {
          if (status === 200) {
            setIsModalOpen(true);
            setBaraaniiTsuvraluud(data);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else {
      setBaraaniiTsuvraluud(data.tsuvral);
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setBaraaniiTsuvraluud();
    setToo();
  };

  function onFinish() {
    if (!too && too > 0) {
      return AnkhaaruulgaAlert("Тоо оруулаагүй байна");
    }

    var yavuulakhData = {
      id: ekhelsenToollogo?._id,
      code: data?.code,
      too,
    };

    if (!!baraaniiTsuvraluud) {
      yavuulakhData.tsuvral = baraaniiTsuvraluud;
    }

    posUilchilgee(token)
      .post("/toololtKhadgalyaa", yavuulakhData)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setBaraaniiTsuvraluud();
          ekhelsenToollogoMutate();
          setToo();
          setIsModalOpen(false);
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
      });
  }
  return (
    <>
      {/* <Button onClick={openModal}>Тоо оруулах</Button> */}
      <Button type="tableButton" className="!h-8 w-full" onClick={openModal}>
        <div
          className={`${
            !!data.zoruu?.iluuToo || data?.zoruu?.iluuToo > 0
              ? "text-green-500"
              : !!data.zoruu?.dutuuToo || data?.zoruu?.dutuuToo > 0
              ? "text-red-500"
              : ""
          }`}>
          {formatNumber(toolsonToo, 2)}
        </div>
      </Button>
      {/* 
      <div
        onClick={openModal}
        className='flex w-full cursor-pointer items-center justify-center gap-2 underline underline-offset-2 duration-500  hover:bg-green-400/50'>
        {formatNumber(toolsonToo, 2)}
        <CiEdit /> */}
      {/* </div> */}
      <Modal
        width={"538px"}
        okText="Эхлүүлэх"
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={handleCancel} style={{ width: "100px" }}>
              Гарах
            </Button>
            {data.tsuvraliinDugaartaiEsekh &&
              !data.ognooniiMedeelelBurtgekhEsekh && (
                <TsuvralOruulakhModal
                  baraaniiUndesehTsuvraluud={baraaniiTsuvraluud}
                  setBaraaniiUndesehTsuvraluud={setBaraaniiTsuvraluud}
                />
              )}
            {!data.tsuvraliinDugaartaiEsekh &&
              data.ognooniiMedeelelBurtgekhEsekh && (
                <MushgiltOruulakhModal
                  baraaniiUndesehTsuvraluud={baraaniiTsuvraluud}
                  setBaraaniiUndesehTsuvraluud={setBaraaniiTsuvraluud}
                />
              )}

            {data.tsuvraliinDugaartaiEsekh &&
              data.ognooniiMedeelelBurtgekhEsekh && (
                <TsuvralBolonMushgiltOruulakhModal
                  baraaniiUndesehTsuvraluud={baraaniiTsuvraluud}
                  setBaraaniiUndesehTsuvraluud={setBaraaniiTsuvraluud}
                />
              )}

            <Button
              onClick={onFinish}
              style={{ width: "100px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">Тоо бичих</div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex flex-col gap-2">
          <div className="w-full">
            <div className="flex justify-between gap-2">
              <div>Нэр:</div>
              <div>{data?.ner}</div>
            </div>
            <div className="flex justify-between gap-2">
              <div>Дотоод код:</div>
              <div>{data?.code}</div>
            </div>
            <div className="flex justify-between gap-2">
              <div>Бар код:</div>
              <div>{data?.barCode}</div>
            </div>
            <div className="flex justify-between gap-2">
              <div>Үлдэгдэл:</div>
              <div>{formatNumber(data?.etssiinUldegdel, 2)}ш</div>
            </div>
          </div>

          {baraaniiTsuvraluud?.map((e) => {
            return (data.ognooniiMedeelelBurtgekhEsekh &&
              data.tsuvraliinDugaartaiEsekh) ||
              data.tsuvraliinDugaartaiEsekh ? (
              <div
                className={
                  "flex h-fit w-[100%] cursor-pointer items-center justify-between rounded-2xl border-[1px] border-[#4FD1C5] px-5 py-2 hover:bg-[rgb(79,209,197)]/50"
                }>
                <div className="font-medium text-[#8C96A7]">
                  {data.ognooniiMedeelelBurtgekhEsekh &&
                  data.tsuvraliinDugaartaiEsekh ? (
                    <div>
                      <div>{e.dugaar}</div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  ) : data.tsuvraliinDugaartaiEsekh ? (
                    <div>{e.dugaar}</div>
                  ) : (
                    <div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center">
                  <TooShirkhegInput
                    value={e.toolsonToo}
                    autoFocus={true}
                    ref={inputRef}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(value) => addInputValue(value, e.dugaar)}
                    autoComplete="off"
                    style={{
                      width: "100%",
                      borderColor: "#4FD1C5",
                      borderRadius: "25px",
                      borderWidth: 1,
                    }}
                    placeholder="Тоо ширхэг"
                  />
                </div>
              </div>
            ) : (
              <div
                className={
                  "flex h-fit w-[100%] cursor-pointer items-center justify-between rounded-2xl border-[1px] border-[#4FD1C5] px-5 py-2 hover:bg-[rgb(79,209,197)]/50"
                }>
                <div className="font-medium text-[#8C96A7]">
                  {data.ognooniiMedeelelBurtgekhEsekh &&
                  data.tsuvraliinDugaartaiEsekh ? (
                    <div>
                      <div>{e.dugaar}</div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  ) : data.tsuvraliinDugaartaiEsekh ? (
                    <div>{e.dugaar}</div>
                  ) : (
                    <div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center">
                  <TooShirkhegInput
                    ref={inputRef}
                    value={e.toolsonToo}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(value) =>
                      addInputValueOgnoo(value, e.duusakhOgnoo)
                    }
                    autoComplete="off"
                    style={{
                      width: "100%",
                      borderColor: "#4FD1C5",
                      borderRadius: "25px",
                      borderWidth: 1,
                    }}
                    placeholder="Тоо ширхэг"
                  />
                </div>
              </div>
            );
          })}
          {data?.tsuvraliinDugaartaiEsekh === false &&
          data?.ognooniiMedeelelBurtgekhEsekh === false ? (
            <TooShirkhegInput
              autoFocus={true}
              value={too}
              ref={inputRef}
              onChange={(v) => setToo(v)}
              placeHolder="Тоо"
            />
          ) : (
            ""
          )}
        </div>
      </Modal>
    </>
  );
}

export default TooBichihModal;
