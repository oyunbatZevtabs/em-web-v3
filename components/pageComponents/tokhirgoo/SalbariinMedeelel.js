import React, { useEffect, useState } from "react";
import { Button, Form, Switch, message, Divider } from "antd";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";
import { Input, InputNumber } from "components/ant/AntdInput";
import { PercentageOutlined } from "@ant-design/icons";
import { useAuth } from "services/auth";
import useData from "hooks/useData";
import BaiguullagaBurtgelAlkham from "components/modalBody/hynalt/salbarNemekhsModal";

function SalbariinMedeelel() {
  const [form] = Form.useForm();
  const { token, baiguullaga, salbariinId, baiguullagiinId } = useAuth();
  const [khaaltAshiglakhEsekh, setKhaaltAshiglakhEsekh] = useState(
    baiguullaga?.tokhirgoo?.khaaltAshiglakhEsekh || false
  );
  const { data: emiinSanData, mutate: emiinSanSalbarMutate } = useData(
    token,
    "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  return (
    <div className=" flex h-[500ox] w-[70%] flex-col  rounded-lg bg-white p-2 dark:border-2 dark:text-gray-200 dark:border-[#4FD1C5] dark:bg-gray-900 ">
      <div className="flex h-[72px] items-center justify-between">
        <div className="text-[18px] font-semibold">Салбарын мэдээлэл</div>
        <BaiguullagaBurtgelAlkham
          salbariinId={salbariinId}
          token={token}
          mutate={emiinSanSalbarMutate}
          readonly={false}
          ugugdul={undefined}
          baiguullagiinId={baiguullagiinId}
        />
      </div>
      <Divider className="!my-2" />
      <div className="flex h-[100%] w-full flex-col items-center justify-center gap-2 overflow-y-auto ">
        {emiinSanData?.map((item, index) => (
          <div
            className="flex w-[95%] items-center rounded-md border p-2 shadow-md "
            key={index}
          >
            <div className="flex w-full  flex-col items-start justify-center gap-4">
              <div className="font-[700] leading-4 text-[#718096]">
                {item?.ner}
              </div>
              <div>
                <div className="flex gap-1 truncate">
                  <div className="font-[400] text-[#A0AEC0]">Утас:</div>
                  <div className="font-[400] text-[#718096]">{item?.utas}</div>
                </div>
                <div className="flex gap-2 truncate">
                  <div className="font-[400] text-[#A0AEC0]">Хаяг:</div>
                  <div className="font-[400] text-[#718096]">
                    {item?.khayag}
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-4">
              <BaiguullagaBurtgelAlkham
                salbariinId={salbariinId}
                token={token}
                mutate={emiinSanSalbarMutate}
                readonly={false}
                ugugdul={item}
                baiguullagiinId={baiguullagiinId}
              />
              <BaiguullagaBurtgelAlkham
                salbariinId={salbariinId}
                token={token}
                mutate={emiinSanSalbarMutate}
                readonly={true}
                ugugdul={item}
                baiguullagiinId={baiguullagiinId}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalbariinMedeelel;
