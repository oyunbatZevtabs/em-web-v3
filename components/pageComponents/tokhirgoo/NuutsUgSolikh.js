import React, { useState } from "react";
import { Button, Input, message } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";

function NuutsUgSolikh({ ajiltan, token, ajiltanMutate, khadgalsniiDaraa }) {
  const [state, setstate] = useState(ajiltan);

  function onChange({ target }) {
    setstate((s) => ({ ...s, [target.name]: target.value }));
  }
  function khadgalakh() {
    const { shineNuutsUg, shineNuutsUgDavtan, ...ajiltanObject } = state;
    if (!!shineNuutsUg && shineNuutsUg === shineNuutsUgDavtan) {
      ajiltanObject.nuutsUg = shineNuutsUg;
      updateMethod("ajiltan", token, ajiltanObject).then(({ data, status }) => {
        if (status === 200 && "Amjilttai" === data) {
          AmjilttaiAlert("Амжилттай заслаа");
          ajiltanMutate({ ...ajiltanObject });
        }
      });
    } else {
      AldaaAlert("Мэдээлэл буруу оруулсан байна");
    }
  }

  return (
    <div className="xxl:col-span-9 col-span-12 lg:col-span-8">
      <div className="intro-y box lg:mt-5 ">
        <div className=" flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-50 ">
            Нууц үг солих
          </h2>
        </div>
        <div className="flex w-[100%]">
          <div className="grid w-[100%] grid-cols-12 gap-x-5">
            <div className="col-span-6">
              <div className="mt-3">
                <div>Шинэ нууц үг</div>
                <Input.Password
                  style={{
                    width: "100%",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  className="form-control"
                  placeholder="Шинэ нууц үг"
                  name="shineNuutsUg"
                  onChange={(e) => onChange(e, "shineNuutsUg")}
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-3">
                <div>Шинэ нууц үг давтан</div>
                <Input.Password
                  style={{
                    width: "100%",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  className="form-control"
                  placeholder="Шинэ нууц үг давтан"
                  name="shineNuutsUgDavtan"
                  onChange={(e) => onChange(e, "shineNuutsUgDavtan")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            className="btn btn-primary mt-4"
            onClick={khadgalakh}
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NuutsUgSolikh;
