import { Button, Input } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import TooShirkhegInput from "components/ant/AntdInput";
import _ from "lodash";

function TsuvralSongoltModal({
  turul,
  baraaniiData,
  setZakhialga,
  zakhialgaBaraanuud,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [baraa, setBaraa] = useState(_.cloneDeep(baraaniiData));

  useEffect(() => {
    if (isModalOpen) {
      setBaraa(_.cloneDeep(baraaniiData));
    }
  }, [isModalOpen, zakhialgaBaraanuud, baraaniiData]);

  function handleCancel() {
    setIsModalOpen(false);
  }

  function butsaahTsuvraltaiBaraaniiToo(value, tsuvraliinId) {
    setBaraa((prevBaraa) => {
      if (value > 0) {
        const updatedTsuvral = _.cloneDeep(prevBaraa?.tsuvral)?.map((tsu) => {
          if (tsu._id === tsuvraliinId) {
            tsu.too = value;
            tsu.hudulguunTsuvralToo = value;
          }
          return tsu;
        });
        var too = updatedTsuvral?.reduce(
          (a, b) => a + (b.hudulguunTsuvralToo || 0),
          0
        );

        let orlogdohNiitUne = baraaniiData.urtugUne * too;

        return {
          ...prevBaraa,
          too,
          orlogdohNiitUne,
          tsuvral: updatedTsuvral,
        };
      } else {
        const updatedTsuvral = _.cloneDeep(prevBaraa?.tsuvral)?.map(
          (tsuvral) => {
            var tuukhTsuvral = baraaniiData.tsuvral.find(
              (e) => e._id === tsuvral._id
            );

            if (tsuvral._id === tsuvraliinId) {
              delete tsuvral.hudulguunTsuvralToo;
              tsuvral.too = tuukhTsuvral?.too;
            }
            return tsuvral;
          }
        );

        var too = updatedTsuvral?.reduce(
          (a, b) => a + (b.hudulguunTsuvralToo || 0),
          0
        );

        return {
          ...prevBaraa,
          too,
          tsuvral: updatedTsuvral,
        };
      }
    });
  }

  function onFinish() {
    setZakhialga((prev) => ({
      ...prev,
      baraanuud: prev.baraanuud.map((item) =>
        item._id === baraa._id ? baraa : item
      ),
    }));
    setIsModalOpen(false);
  }

  // function onFinish() {
  //   setZakhialga((prev) => ({
  //     ...prev,
  //     baraanuud: [
  //       ...prev.baraanuud.filter((item) => item._id !== baraa._id),
  //       baraa,
  //     ],
  //   }));
  //   setIsModalOpen(false);
  // }

  return (
    <>
      <Button
        disabled={turul === "delgerengui"}
        className="!h-8 w-full"
        onClick={() => setIsModalOpen(true)}>
        <div>
          {formatNumber(
            zakhialgaBaraanuud.find((e) => e._id === baraaniiData._id)?.too,
            2
          )}
        </div>
      </Button>
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
            {/* {baraaniiData?.ognooniiMedeelelBurtgekhEsekh &&
            baraaniiData?.tsuvraliinDugaartaiEsekh
              ? "Цувралын дугаар"
              : baraaniiData.tsuvraliinDugaartaiEsekh
              ? "Цувралын дугаар"
              : "Огноо"} */}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex flex-col items-center gap-2">
          {baraaniiData?.tsuvral?.map((e, index) => {
            if (e.uldegdel === 0) {
              return null;
            }

            return (
              <div
                key={index}
                className={`flex h-fit w-[466px] cursor-pointer items-center justify-between rounded-2xl border-[1px] border-[#4FD1C5] bg-[rgb(79,209,197)]/50 px-5 py-2 hover:bg-[rgb(79,209,197)]/50`}>
                <div className="font-medium text-[#8C96A7]">
                  {baraaniiData?.ognooniiMedeelelBurtgekhEsekh &&
                  baraaniiData?.tsuvraliinDugaartaiEsekh ? (
                    <div>
                      <div>{e.dugaar}</div>
                      <div>{moment(e?.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  ) : baraaniiData?.tsuvraliinDugaartaiEsekh ? (
                    <div>{e?.dugaar}</div>
                  ) : (
                    <div>
                      <div>{moment(e.duusakhOgnoo).format("YYYY-MM-DD")}</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div>Тоо: {formatNumber(e?.uldegdel, 2)} </div>

                  <TooShirkhegInput
                    value={
                      baraa?.tsuvral?.find((el) => el._id === e._id)
                        ?.hudulguunTsuvralToo || 0
                    }
                    onClick={(e) => e.stopPropagation()}
                    onChange={(value) =>
                      butsaahTsuvraltaiBaraaniiToo(value, e._id)
                    }
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
