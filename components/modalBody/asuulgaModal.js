import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { handleClientScriptLoad } from "next/script";

function AsuulgaModal({ type, tiim, ugui, text }) {
  if (type === "ankhaar") {
    return (
      <div className="flex h-[100px] w-[445px] flex-col gap-2 rounded-2xl bg-white p-2 dark:rounded-2xl dark:bg-gray-800">
        <div name="ehnii2" className="flex items-center justify-start gap-2">
          <div name="icon " className=" text-2xl text-[#4FD1C5] ">
            <InfoCircleOutlined />
          </div>
          <div className="text-[#061C3D] dark:text-gray-50">Анхаар</div>
        </div>
        <div className="text-[#ffffff]" name="text">
          {text || "Та хадгалахгүй гарахдаа итгэлтэй байна уу?"}
        </div>
        <div className="flex items-center justify-end gap-2" name="buttons">
          <button
            onClick={() => ugui()}
            className="btn border-[#4FD1C5]  text-[#4FD1C5]"
          >
            Үгүй
          </button>
          <button
            onClick={() => tiim()}
            className="btn bg-[#4FD1C5] text-[#FFFFFF]"
          >
            Тийм
          </button>
        </div>
      </div>
    );
  } else if (type === "amjilttai") {
    return (
      <div className="flex w-[424px] flex-col gap-2 rounded-2xl bg-white p-2">
        <div name="ehnii2" className="flex items-center justify-start gap-2">
          <div name="icon " className=" text-2xl text-[#4FD1C5]">
            <InfoCircleOutlined />
          </div>
          <div className="text-[#061C3D]">Анхаар</div>
        </div>
        <div className="text-[#6A778B]" name="text">
          Та хадгалахгүй гарахдаа итгэлтэй байна уу?
        </div>
        <div className="flex items-center justify-end gap-2" name="buttons">
          <button className="btn border-[#4FD1C5]  text-[#4FD1C5]">Үгүй</button>
          <button className="btn bg-[#4FD1C5] text-[#FFFFFF]">Тийм</button>
        </div>
      </div>
    );
  } else if (type === "aldaa") {
    return (
      <div className="flex w-[424px] flex-col gap-2 rounded-2xl bg-white p-2">
        <div name="ehnii2" className="flex items-center justify-start gap-2">
          <div name="icon " className=" text-2xl text-[#4FD1C5]">
            <InfoCircleOutlined />
          </div>
          <div className="text-[#061C3D]">Анхаар</div>
        </div>
        <div className="text-[#6A778B]" name="text">
          Та хадгалахгүй гарахдаа итгэлтэй байна уу?
        </div>
        <div className="flex items-center justify-end gap-2" name="buttons">
          <button
            name={"ugui"}
            onClick={() => ugui()}
            className="btn border-[#4FD1C5]   text-[#4FD1C5]"
          >
            Үгүй
          </button>
          <button
            name={"tiim"}
            onClick={() => tiim()}
            className="btn bg-[#4FD1C5] text-[#FFFFFF]"
          >
            Тийм
          </button>
        </div>
      </div>
    );
  }
}
export default AsuulgaModal;
