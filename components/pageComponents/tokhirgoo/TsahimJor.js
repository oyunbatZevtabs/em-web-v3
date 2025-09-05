import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
// import posUilchilgee from "services/posUilchilgee";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";
import { InputPassword, Input } from "components/ant/AntdInput";

function TsahimJor({ ajiltan, token, baiguullagiinId }) {
  const [state, setState] = useState({
    nevtrekhNer: "",
    nuutsUg: "",
  });

  useEffect(() => {
    uilchilgee(token)
      .post("/tsahimJorErkhAvya", { baiguullagiinId: baiguullagiinId })
      .then((khariu) => {
        setState({
          nevtrekhNer: khariu.data?.tokhirgoo?.EMYTSS?.nevtrekhNer,
          nuutsUg: khariu?.data?.tokhirgoo?.EMYTSS?.nuutsUg,
        });
      })
      .catch((e) => aldaaBarigch(e));
  }, []);

  function onChange({ target }) {
    setState((prevState) => ({ ...prevState, [target.name]: target.value }));
  }

  function khadgalakh() {
    const { nevtrekhNer, nuutsUg } = state;
    if (!!nevtrekhNer && nuutsUg) {
      const data = { nevtrekhNer, nuutsUg, id: baiguullagiinId };
      uilchilgee(token)
        .post("/tsahimJorErkhOruulyaa", data)
        .then(({ data, status }) => {
          if (status === 200 && data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгаллаа");
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else {
      AldaaAlert("Мэдээлэл буруу оруулсан байна");
    }
  }

  return (
    <div className="xxl:col-span-9 col-span-12 lg:col-span-8">
      <div className="intro-y box lg:mt-5">
        <div className=" flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-50 ">
            Цахим жор
          </h2>
        </div>
        <div className="flex w-[100%]">
          <div className="grid w-[100%] grid-cols-12 gap-x-5">
            <div className="col-span-6">
              <div className="mt-3">
                <div>Нэвтрэх нэр</div>
                <Input
                  placeholder="Нэвтрэх нэр"
                  name="nevtrekhNer"
                  value={state.nevtrekhNer}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-3">
                <div>Нууц үг</div>
                <InputPassword
                  placeholder="Нууц үг"
                  name="nuutsUg"
                  value={state.nuutsUg}
                  onChange={onChange}
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

export default TsahimJor;
