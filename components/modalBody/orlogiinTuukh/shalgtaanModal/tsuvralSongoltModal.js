import { Button, Input } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import TooShirkhegInput from "components/ant/AntdInput";
import _ from "lodash";

function TsuvralSongoltModal({
  tuukhBaraa,
  setTooBichsenBaraanuud,
  tooBichsenBaraanuud,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [baraa, setBaraa] = useState(
    tooBichsenBaraanuud.find((e) => e?._id === tuukhBaraa?._id) || tuukhBaraa
  );
  // const [nuurendeerKharuukakhData, setNuurendeerKharuukakhData] = useState(
  //   tooBichsenBaraanuud.find((e) => e?._id === tuukhBaraa?._id)
  // );

  function handleCancel() {
    setIsModalOpen(false);
  }

  function butsaahTsuvraltaiBaraaniiToo(value, tsuvraliinId) {
    setBaraa((prevBaraa) => {
      if (value > 0) {
        const updatedTsuvral = _.cloneDeep(prevBaraa?.tsuvral)?.map(
          (tsuvral) => {
            // var tuukhTsuvral = tuukhBaraa.tsuvral.find(
            //   (e) => e._id === tsuvral._id
            // );

            if (tsuvral._id === tsuvraliinId) {
              // tsuvral.too = tuukhTsuvral?.too - value;
              tsuvral.too = value;
              tsuvral.butsaakhToo = value;
            }
            return tsuvral;
          }
        );
        var too = updatedTsuvral.reduce((a, b) => a + (b.butsaakhToo || 0), 0);

        let niitUne = tuukhBaraa.urtugUne * too;

        return {
          ...prevBaraa,
          too,
          niitUne,
          tsuvral: updatedTsuvral,
        };
      } else {
        const updatedTsuvral = _.cloneDeep(prevBaraa?.tsuvral)?.map(
          (tsuvral) => {
            var tuukhTsuvral = tuukhBaraa.tsuvral.find(
              (e) => e._id === tsuvral._id
            );

            if (tsuvral._id === tsuvraliinId) {
              delete tsuvral.butsaakhToo;
              tsuvral.too = tuukhTsuvral?.too;
            }
            return tsuvral;
          }
        );

        // var butsaakhToo = updatedTsuvral.reduce(
        //   (a, b) => a + (b.butsaakhToo || 0),
        //   0
        // );
        var too = updatedTsuvral.reduce((a, b) => a + (b.butsaakhToo || 0), 0);

        return {
          ...prevBaraa,
          too,
          tsuvral: updatedTsuvral,
        };
      }
    });
  }

  function onFinish() {
    const hadgalakhBaraaData = baraa.tsuvral.filter((e) => {
      return e.butsaakhToo !== undefined;
    });
    baraa.tsuvral = hadgalakhBaraaData;
    if (baraa.too <= 0) {
      setTooBichsenBaraanuud((prev) =>
        prev.filter((item) => item._id !== baraa._id)
      );
      setIsModalOpen(false);
    } else {
      setTooBichsenBaraanuud((prev) => [
        ...prev.filter((item) => item._id !== baraa._id),
        baraa,
      ]);
      setIsModalOpen(false);
    }
  }


  return (
    <>
      <div
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[10px] border-[1px] border-white bg-[#4FD1C5] duration-300 hover:opacity-40 xl:h-[40px] xl:w-[40px]">
        <BiMenu className="cursor-pointer text-[15px] text-white xl:text-[25px]" />
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
            {tuukhBaraa?.ognooniiMedeelelBurtgekhEsekh &&
            tuukhBaraa?.tsuvraliinDugaartaiEsekh
              ? "Цувралын дугаар"
              : tuukhBaraa.tsuvraliinDugaartaiEsekh
              ? "Цувралын дугаар"
              : "Огноо"}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex flex-col items-center gap-2">
          {tuukhBaraa?.tsuvral?.map((e, index) => {
            return (
              <div
                key={index}
                className={`flex h-fit w-[466px] cursor-pointer items-center justify-between rounded-2xl border-[1px] border-[#4FD1C5] bg-[rgb(79,209,197)]/50 px-5 py-2 hover:bg-[rgb(79,209,197)]/50`}>
                <div className="font-medium text-[#8C96A7]">
                  {tuukhBaraa?.ognooniiMedeelelBurtgekhEsekh &&
                  tuukhBaraa?.tsuvraliinDugaartaiEsekh ? (
                    <div>
                      <div>{e.dugaar}</div>
                      <div>{moment(e?.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  ) : tuukhBaraa?.tsuvraliinDugaartaiEsekh ? (
                    <div>{e?.dugaar}</div>
                  ) : (
                    <div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div>Тоо: {formatNumber(e?.too, 2)} </div>

                  <TooShirkhegInput
                    value={
                      baraa?.tsuvral?.find((el) => el._id === e._id)
                        ?.butsaakhToo || 0
                    }
                    onClick={(e) => e.stopPropagation()}
                    onChange={(value) =>
                      butsaahTsuvraltaiBaraaniiToo(value, e._id)
                    }
                    max={e.too}
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
        </div>
      </Modal>
    </>
  );
}
export default TsuvralSongoltModal;
