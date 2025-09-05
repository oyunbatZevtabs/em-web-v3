import { Button } from "antd";
import TooShirkhegInput from "components/ant/AntdInput";
import { Modal } from "components/ant/AntdModal";
import moment from "moment";
import React, { useState } from "react";
import { BiMenu } from "react-icons/bi";
import formatNumber from "tools/function/formatNumber";

function TsuvralYanzlakhModal({ data, form, index, onSave }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orjIrsenTsuvral, setOrjIrsenTsuvral] = useState(data?.tsuvral || []);
  function handleCancel() {
    setIsModalOpen(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function yanzalya() {
    form.setFieldValue(["baraanuud", index, "tsuvral"], orjIrsenTsuvral);
    const niitToo = orjIrsenTsuvral?.reduce((sav, mur) => {
      return sav + (mur.too || 0);
    }, 0);
    form.setFieldValue(["baraanuud", index, "too"], niitToo);
    form.setFieldValue(
      ["baraanuud", index, "niitUne"],
      niitToo * (data?.urtugUne || 0)
    );
    setIsModalOpen(false);
    onSave(niitToo);
  }

  function handleValueUurchlult(value, i) {
    setOrjIrsenTsuvral((e) => {
      const shineTsuvral = [...e];
      shineTsuvral[i].too = value;
      return shineTsuvral;
    });
  }

  return (
    <>
      <Button
        onClick={openModal}
        type="tableButton"
        style={{ height: 32, borderRadius: 25, width: "100%" }}
      >
        {formatNumber(
          orjIrsenTsuvral?.reduce((sav, mur) => {
            return sav + (mur.too || 0);
          }, 0),
          2
        )}
      </Button>
      <Modal
        okText="Хадгалах"
        footer={
          <div className="flex w-full justify-end">
            <Button
              onClick={yanzalya}
              style={{ width: "100px" }}
              type="primary"
            >
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={"Цуврал сонгох"}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <div className="flex max-h-[calc(100vh-18rem)] w-full flex-col gap-2 overflow-y-auto">
          {data.tsuvral
            .filter((tukhainData) => tukhainData.uldegdel !== 0)
            .map((e, i) => {
              return (
                <div
                  key={i}
                  className={`flex h-fit w-[466px] cursor-pointer items-center justify-between rounded-2xl border-[1px] border-[#4FD1C5] px-5 py-2 hover:bg-[rgb(79,209,197)]/50`}
                >
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
                    <div>Үлдэгдэл: {formatNumber(e.uldegdel, 2)} </div>
                    <TooShirkhegInput
                      onChange={(v) => handleValueUurchlult(v, i)}
                      value={e.too}
                      onClick={(e) => e.stopPropagation()}
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

export default TsuvralYanzlakhModal;
