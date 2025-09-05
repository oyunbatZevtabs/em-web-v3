import { Button, Input } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { InputNumber } from "../antdInput";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import TooShirkhegInput from "components/ant/AntdInput";

function TsuwraliinDugaarSongokh({
  data,
  songogdsomEmnuud,
  setSongogdsomEmnuud,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songojavsanTsuwraliinDugaar, setSongojavsanTsuwraliinDugaar] = useState([]);
  const [dataTsuvral, setDataTsuvral] = useState([]);

  useEffect(() => {
    if (!!isModalOpen) {
      setSongojavsanTsuwraliinDugaar(data.zarakhTsuvral);
      setDataTsuvral(data.tsuvral);
    }
  }, [isModalOpen]);

  function handleCancel() {
    setIsModalOpen(false);
  }

  function tsuwraliinDugaarSongoh(tsuwraliinDugaar, i) {
    const index = songojavsanTsuwraliinDugaar?.findIndex(
      (item) => item._id === tsuwraliinDugaar._id
    );

    if (index !== -1) {
      var updatedArray = [
        ...songojavsanTsuwraliinDugaar?.slice(0, index),
        ...songojavsanTsuwraliinDugaar?.slice(index + 1),
      ];

      setSongojavsanTsuwraliinDugaar(updatedArray);
    } else {
      const updatedArray = [...songojavsanTsuwraliinDugaar, tsuwraliinDugaar];
      setSongojavsanTsuwraliinDugaar(updatedArray);
    }
  }

  function addInputValue(value, _id) {
    const updatedTsuwraliinDugaar = [...songojavsanTsuwraliinDugaar];
    const updatedTsuwral = [...dataTsuvral];

    const itemIndexTsuvral = updatedTsuwral.findIndex(
      (item) => item._id === _id
    );
    const itemIndex = updatedTsuwraliinDugaar.findIndex(
      (item) => item._id === _id
    );

    if (itemIndexTsuvral !== -1) {
      setDataTsuvral((prevDataTsuvral) => {
        const updatedDataTsuvral = prevDataTsuvral.map((item) =>
          item._id === _id ? { ...item, too: value } : item
        );

        return updatedDataTsuvral;
      });
    }

    if (itemIndex !== -1) {
      updatedTsuwraliinDugaar[itemIndex].too = value;

      setSongojavsanTsuwraliinDugaar(updatedTsuwraliinDugaar);
    }
  }

  function onFinish() {
    var zarakhTsuwraliinDugaarTaiData = {
      ...data,
      tsuvral: dataTsuvral,
      zarakhTsuvral: songojavsanTsuwraliinDugaar,
    };

    const sumOfTooValues = zarakhTsuwraliinDugaarTaiData.zarakhTsuvral
      .filter((item) => item.too !== null && !isNaN(item.too))
      .reduce((sum, item) => parseFloat(sum) + (parseFloat(item.too) || 0), 0);

    zarakhTsuwraliinDugaarTaiData.shirkheg = sumOfTooValues;
    zarakhTsuwraliinDugaarTaiData.zarsanNiitUne =
      zarakhTsuwraliinDugaarTaiData.niitUne * sumOfTooValues;

    var shineJagsaalt = songogdsomEmnuud.filter(
      (a) => a._id !== zarakhTsuwraliinDugaarTaiData._id
    );
    if(!!zarakhTsuwraliinDugaarTaiData.negKhairtsaganDahiShirhegiinToo)
      zarakhTsuwraliinDugaarTaiData.zadlakhToo = zarakhTsuwraliinDugaarTaiData.shirkheg * zarakhTsuwraliinDugaarTaiData.negKhairtsaganDahiShirhegiinToo;
    shineJagsaalt.push(zarakhTsuwraliinDugaarTaiData);

    setSongogdsomEmnuud(shineJagsaalt);

    handleCancel();
  }

  return (
    <>
      <div className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[10px] border-[1px] border-white bg-[#4FD1C5] duration-300 hover:opacity-40 xl:h-[40px] xl:w-[40px]">
        <BiMenu
          onClick={() => {
            setIsModalOpen(true),
              setSongojavsanTsuwraliinDugaar(data.zarakhTsuvral || []);
          }}
          className="cursor-pointer text-[15px] text-white xl:text-[25px]"
        />
      </div>

      <Modal
        destroyOnClose={true}
        width={"538px"}
        okText="Бүртгэх"
        footer={
          <div className="flex w-full justify-end">
            <Button
              onClick={onFinish}
              style={{ width: "186px", height: "36px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            {data.ognooniiMedeelelBurtgekhEsekh && data.tsuvraliinDugaartaiEsekh
              ? "Цувралын дугаар"
              : data.tsuvraliinDugaartaiEsekh
              ? "Цувралын дугаар"
              : "Огноо"}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex flex-col items-center gap-2">
          {data.tsuvral.map((e, index) => {
            return (
              <div
                key={index}
                onClick={() => tsuwraliinDugaarSongoh(e, index)}
                className={`${
                  songojavsanTsuwraliinDugaar?.some(
                    (item) => item._id === e._id
                  )
                    ? "bg-[rgb(79,209,197)]/50"
                    : ""
                } flex h-fit w-[466px] cursor-pointer items-center justify-between rounded-2xl border-[1px] border-[#4FD1C5] px-5 py-2 hover:bg-[rgb(79,209,197)]/50`}>
                <div className="font-medium text-[#8C96A7]">
                  {data.ognooniiMedeelelBurtgekhEsekh &&
                  data.tsuvraliinDugaartaiEsekh ? (
                    <div>
                      <div>{e.dugaar}</div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  ) : data.tsuvraliinDugaartaiEsekh ? (
                    <div className="dark:text-gray-200">{e.dugaar}</div>
                  ) : (
                    <div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center dark:text-gray-200">
                  <div>Үлдэгдэл: {formatNumber(e.uldegdel, 2)} </div>
                  {songojavsanTsuwraliinDugaar?.some(
                    (item) => item._id === e._id
                  ) ? (
                    <TooShirkhegInput
                      value={e.too}
                      onClick={(e) => e.stopPropagation()}
                      disabled={
                        songojavsanTsuwraliinDugaar?.some(
                          (item) => item._id === e._id
                        )
                          ? false
                          : true
                      }
                      onChange={(value) => addInputValue(value, e._id)}
                      max={e.uldegdel}
                      autoComplete="off"
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      placeholder="Тоо ширхэг"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
export default TsuwraliinDugaarSongokh;
