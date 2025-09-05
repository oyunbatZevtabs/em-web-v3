import React, { useState } from "react";
import { Button, InputNumber, notification, Switch } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

function KhuviinMedeelel({ token }) {
  const { ajilchdiinGaralt, ajiltniiJagsaaltMutate } =
    useAjiltniiJagsaalt(token);

  const [ajiltniiTokhirgoo, setAjiltniiTokhirgoo] = useState(null);
  const [gereeTokhirgoo, setGereeTokhirgoo] = useState(null);

  const ajiltniiTokhirgooKhadgalya = () => {
    const ajiltnuud = [];
    for (const ajiltan in ajiltniiTokhirgoo)
      ajiltnuud.push({ _id: ajiltan, utga: ajiltniiTokhirgoo[ajiltan] });
    ajiltniiTokhirgoo.turul = "tokhirgoo.gereeZasakhErkh";
    ajiltniiTokhirgoo.ajiltnuud = ajiltnuud;
    uilchilgee(token)
      .post("/ajiltniiTokhirgooZasya", ajiltniiTokhirgoo)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          ajiltniiJagsaaltMutate();
          AmjilttaiAlert("Амжилттай засагдлаа");
          setAjiltniiTokhirgoo(null);
        }
      });
  };

  const gereeTokhirgooKhadgalya = () => {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: gereeTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай засагдлаа");
          setGereeTokhirgoo(null);
        }
      });
  };

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium">
              Гэрээ засах эрх ажилтнаар
            </h2>
          </div>
          {ajilchdiinGaralt?.jagsaalt?.map((a) => (
            <div className="box" key={a?._id}>
              <div className="flex flex-col items-center p-5 lg:flex-row">
                <div className="image-fit h-24 w-24 lg:mr-1 lg:h-12 lg:w-12">
                  <img
                    alt={a?.ner}
                    src={
                      a?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${a?.zurgiinNer}`
                        : "/profile.svg"
                    }
                    className="rounded-full"
                  />
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:mt-0 lg:text-left">
                  <a className="font-medium">{a?.ner}</a>
                  <div className="mt-0.5 text-xs text-gray-600">
                    {a?.albanTushaal}
                  </div>
                </div>
                <div className="mt-4 flex lg:mt-0">
                  <Switch
                    defaultChecked={a?.tokhirgoo?.gereeZasakhErkh || false}
                    onChange={(v) =>
                      setAjiltniiTokhirgoo((o) => ({
                        ...(o || {}),
                        [a._id]: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div
            className={` flex items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2 ${
              !!ajiltniiTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <Button type="primary" onClick={ajiltniiTokhirgooKhadgalya}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className=" flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium ">
              Нийтээр тохируулах
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-[rgba(22,78,99,1)] pl-4">
                <div className="font-medium">Гэрээ автоматаар сунгах</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.gereeAvtomataarSungakhEsekh": v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-[rgba(22,78,99,1)] pl-4">
                <div className="font-medium">Гэрээ нийтээр засвар оруулах</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.bukhAjiltanGereendZasvarOruulakhEsekh": v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={` flex items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2 ${
              !!gereeTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <Button type="primary" onClick={gereeTokhirgooKhadgalya}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KhuviinMedeelel;
