import { CloseOutlined, WarningOutlined } from "@ant-design/icons";
import { notification } from "antd";
import React from "react";

const AldaaAlert = (text) => {
  return notification.error({
    message: false,
    icon: null,
    closeIcon: (
      <CloseOutlined className="text-xl !text-black dark:text-gray-50" />
    ),
    description: (
      <div
        className={` max-h-[90vh] min-h-[90px] min-w-[760px] max-w-[95vw] overflow-auto rounded-md border-l-4 border-l-[#E54545] bg-white p-5 text-black shadow-lg dark:bg-gray-800 dark:text-gray-50`}
      >
        <div className="flex flex-col gap-1">
          <div className="flex gap-3">
            <div className=" flex flex-row text-xl text-[#E54545]">
              <WarningOutlined />
            </div>
            <div className="flex h-[24px] w-[100%] text-[16px] font-bold ">
              Алдаа
            </div>
            <div className="right-5 flex flex-row">
              <button type="primary"></button>
            </div>
          </div>
          <div className="flex pl-8 text-[#838E9E]">{text}</div>
        </div>
      </div>
    ),
  });
};

export default AldaaAlert;
