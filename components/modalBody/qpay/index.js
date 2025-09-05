import { Button, Image, notification, message } from "antd";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState } from "react";
import posUilchilgee, { socket, aldaaBarigch } from "services/posUilchilgee";
import formatNumber from "tools/function/formatNumber";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

function QpayModal({
  baiguullagiinId,
  salbariinId,
  token,
  qpayerTulukh,
  khuleegdejBuiQpay,
  //   handleOpenQpay,
  handleCancelQpay,
  qpayModalTuluv,
  setQpayerTulukh,
  setQpayModalTuluv,
  onFinish,
  qpayerTulukhDun,
  setQpayTulsun,
}) {
  useEffect(() => {
    if (khuleegdejBuiQpay) {
      socket().on(`qpay${khuleegdejBuiQpay}`, (qpay) => {
        // if (qpayerTulukh !== "Tulugdsun") {
        AmjilttaiAlert("Qpay Амжилттай төлөгдлөө");
        setQpayerTulukh("Tulugdsun");
        // onFinish({ tulsun: true });
        handleCancelQpay();
        setQpayTulsun(true);
        // }
      });
    }
    return () => {
      socket().off(`qpay${khuleegdejBuiQpay}`);
    };
  }, [khuleegdejBuiQpay]);

  function qpayShalgakh() {
    if (qpayerTulukh == "Tulugdsun") {
      AmjilttaiAlert("Qpay Амжилттай төлөгдсөн байна");
      handleCancelQpay();
      setQpayTulsun(true);
      notification.success({ message: "Qpay Амжилттай төлөгдсөн байна" });
    } else {
      var body = {
        baiguullagiinId,
        salbariinId,
        zakhialgiinDugaar: khuleegdejBuiQpay,
      };
      posUilchilgee(token)
        .post("/qpayShalgakh", body)
        .then(({ data }) => {
          if (data.tulsunEsekh) {
            AmjilttaiAlert("Qpay Амжилттай төлөгдсөн байна");
            setQpayerTulukh("Tulugdsun");
            handleCancelQpay();
            setQpayTulsun(true);
          } else AnkhaaruulgaAlert("Qpay төлөгдөөгүй байна.");
        })
        .catch((err) => {
          aldaaBarigch(err?.message);
        });
    }
  }
  // useEffect(() => {
  //   if (qpayerTulukh === "Tulugdsun") {
  //     AmjilttaiAlert("Qpay Амжилттай төлөгдлөө");
  //     setQpayerTulukh("Tulugdsun");
  //     // onFinish({ tulsun: true });
  //     handleCancelQpay();
  //     setQpayTulsun(true);
  //   }
  // },[qpayerTulukh])

  return (
    <>
      <Modal
        width={"438px"}
        okText="Бүртгэх"
        footer={false}
        header={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={"QPay"}
        open={qpayModalTuluv}
        onCancel={handleCancelQpay}
      >
        <div className="flex h-[450px] w-full flex-col items-center justify-center gap-[60px] pb-0">
          <img src={`data:image/png;base64,${qpayerTulukh?.qr_image}`}></img>{" "}
        </div>
        <div className="w-full text-center text-green-400">
          {formatNumber(qpayerTulukhDun, 2)} ₮
        </div>
        <div className="w-full p-5 text-center">
          <Button type="primary" onClick={qpayShalgakh}>
            Шалгах
          </Button>
        </div>
      </Modal>
    </>
  );
}
export default QpayModal;
