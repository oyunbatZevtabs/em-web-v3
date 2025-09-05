import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Switch,
  Tooltip,
  notification,
} from "antd";
import DansBurtgel from "./DansBurtgel";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import useDans from "hooks/useDans";
import posUpdateMethod from "tools/function/crud/posUpdateMethod";
import deleteMethod from "tools/function/crud/deleteMethod";

function DansTile({ data, dansMutate, zasya, token }) {
  function ustgaya() {
    deleteMethod("Dans", token, data?._id).then(
      ({ data }) => data === "Amjilttai" && dansMutate()
    );
  }

  return (
    <div className="box w-full">
      <div className="grid w-full grid-cols-4 items-center justify-between gap-2 p-5">
        <div className="">
          <div className="font-medium">{"Данс"}</div>
          <div>{data.dugaar}</div>
        </div>
        <div className="">
          <div className="font-medium">{"Дансны нэр"}</div>
          <div>{data.dansniiNer}</div>
        </div>
        <div className="">
          <div className="font-medium">{"Валют"}</div>
          <div>{data.valyut}</div>
        </div>
        <div className="ml-auto flex space-x-2">
          <Popconfirm
            title={`${data.dugaar} данс устгах уу?`}
            okText={"Тийм"}
            cancelText={"Үгүй"}
            onConfirm={() => ustgaya()}
          >
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 fill-current p-2 text-white">
              <Tooltip title={"Устгах"}>
                <DeleteOutlined size={20} />
              </Tooltip>
            </div>
          </Popconfirm>
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-500 fill-current p-2 text-white"
            onClick={() => zasya(data)}
          >
            <Tooltip title={"Засах"}>
              <EditOutlined />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dans({ baiguullaga, token, salbariinId }) {
  const [khanbankCoprporate, setKhanBankCorporate] = useState(null);
  const [tdbCoprporate, setTdbCorporate] = useState(null);

  const { dansGaralt, dansMutate } = useDans(token);

  const ref = React.useRef(null);

  function dansBurtgeye(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{"Хаах"}</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        {"Хадгалах"}
      </Button>,
    ];
    modal({
      title: "Дансны бүртгэл",
      icon: <PlusOutlined />,
      content: (
        <DansBurtgel
          ref={ref}
          data={data}
          token={token}
          salbariinId={salbariinId}
          baiguullagiinId={baiguullaga?._id}
          dansMutate={dansMutate}
        />
      ),
      footer,
    });
  }

  function dansKhadgalya(turul) {
    const corp = turul === "tdb" ? tdbCoprporate : khanbankCoprporate;
    dansGaralt?.jagsaalt
      ?.filter((a) => a.bank === turul)
      .map((mur, index, array) =>
        posUpdateMethod("Dans", token, { ...mur, ...corp }).then(({ data }) => {
          if (data === "Amjilttai" && array.length - 1 === index) {
            notification.success({ message: "Амжилттай хадгаллаа" });
          }
        })
      );
  }

  return (
    <div className="xxl:col-span-9 col-span-12 lg:col-span-8">
      <div className="intro-y box lg:mt-5">
        <div className=" flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-50 ">
            Дансны тохиргоо
          </h2>
        </div>
        <div className="flex w-[100%] gap-2">
          <div className="w-1/2">
            <div className="box mt-5 lg:mt-0">
              <div className="flex items-center border-b border-gray-200 px-5 pb-2 pt-5 dark:border-[#4FD1C5]">
                <h2 className="mr-auto text-base font-medium dark:text-gray-300">
                  {"Дансны бүртгэл"}
                </h2>
                <div
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-teal-500 fill-current p-2 text-white"
                  onClick={() =>
                    dansBurtgeye({
                      ...(khanbankCoprporate || {}),
                      bank: "khanbank",
                    })
                  }
                >
                  <Tooltip title={"Нэмэх"}>
                    <PlusOutlined />
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center border-b border-gray-200 px-5 pb-2 pt-5 dark:border-[#4FD1C5]">
                <h2 className="mr-auto text-base font-medium dark:text-gray-300">
                  {"Хаан банк"}
                </h2>
                <div className="space-x-2">
                  <label className="mr-auto text-base font-semibold dark:text-gray-200">
                    {"Corporate ашиглах эсэх"}
                  </label>
                  <Switch
                    checked={
                      khanbankCoprporate?.corporateAshiglakhEsekh || false
                    }
                    onChange={(corporateAshiglakhEsekh) =>
                      setKhanBankCorporate((a) => ({
                        ...a,
                        corporateAshiglakhEsekh,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center border-b border-gray-200 px-5 pb-2 pt-5 dark:border-[#4FD1C5]">
                <Form
                  initialValues={khanbankCoprporate}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  autoComplete={"off"}
                >
                  <Form.Item
                    hidden={
                      khanbankCoprporate?.corporateAshiglakhEsekh !== true
                    }
                    label={"Нэвтрэх нэр"}
                    name="corporateNevtrekhNer"
                  >
                    <Input
                      placeholder={"Нууцлагдсан мэдээлэл"}
                      onChange={({ target }) =>
                        setKhanBankCorporate((a) => ({
                          ...a,
                          corporateNevtrekhNer: target.value,
                        }))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    hidden={
                      khanbankCoprporate?.corporateAshiglakhEsekh !== true
                    }
                    label={"Нэвтрэх нууц үг"}
                    name="corporateNuutsUg"
                  >
                    <Input.Password
                      className="!pl-0"
                      placeholder={"Нууцлагдсан мэдээлэл"}
                      onChange={({ target }) =>
                        setKhanBankCorporate((a) => ({
                          ...a,
                          corporateNuutsUg: target.value,
                        }))
                      }
                    />
                  </Form.Item>
                </Form>
              </div>
              {dansGaralt?.jagsaalt
                ?.filter((a) => a.bank === "khanbank")
                .map((mur) => (
                  <DansTile
                    className="box"
                    key={mur._id}
                    data={mur}
                    zasya={dansBurtgeye}
                    dansMutate={dansMutate}
                    token={token}
                  />
                ))}
              <div
                className={`flex items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2 dark:border-[#4FD1C5] ${
                  !!!!(
                    khanbankCoprporate?.corporateNevtrekhNer ||
                    khanbankCoprporate?.corporateNuutsUg ||
                    khanbankCoprporate?.corporateGuilgeeniiNuutsUg
                  )
                    ? "flex"
                    : "hidden"
                }`}
              >
                <Button
                  type="primary"
                  onClick={() => dansKhadgalya("khanbank")}
                >
                  {"Хадгалах"}
                </Button>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <div className="box mt-5 lg:mt-0">
              <div className="flex items-center border-b border-gray-200 px-5 pb-2 pt-5 dark:border-[#4FD1C5]">
                <h2 className="mr-auto text-base font-medium dark:text-gray-300">
                  {"Дансны бүртгэл"}
                </h2>
                <div
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-teal-500 fill-current p-2 text-white"
                  onClick={() =>
                    dansBurtgeye({ ...(tdbCoprporate || {}), bank: "tdb" })
                  }
                >
                  <Tooltip title={"Нэмэх"}>
                    <PlusOutlined />
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center border-b border-gray-200 px-5 pb-2 pt-5 dark:border-[#4FD1C5]">
                <h2 className="mr-auto truncate text-base font-medium dark:text-gray-300">
                  {"Худалдаа хөгжлийн банк"}
                </h2>
                <div className="space-x-2">
                  <label className="mr-auto truncate text-base font-semibold dark:text-gray-300">
                    {"Corporate ашиглах эсэх"}
                  </label>
                  <Switch
                    checked={tdbCoprporate?.corporateAshiglakhEsekh || false}
                    onChange={(corporateAshiglakhEsekh) =>
                      setTdbCorporate((a) => ({
                        ...a,
                        corporateAshiglakhEsekh,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center border-b border-gray-300 px-5 pb-2 pt-5 dark:border-[#4FD1C5]">
                <Form
                  initialValues={tdbCoprporate}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  autoComplete={"off"}
                >
                  <Form.Item
                    hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                    label={"Нэвтрэх нэр"}
                    name="corporateNevtrekhNer"
                  >
                    <Input
                      placeholder={"Нууцлагдсан мэдээлэл"}
                      onChange={({ target }) =>
                        setTdbCorporate((a) => ({
                          ...a,
                          corporateNevtrekhNer: target.value,
                        }))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                    label={"Нэвтрэх нууц үг"}
                    name="corporateNuutsUg"
                  >
                    <Input.Password
                      className="!pl-0"
                      placeholder={"Нууцлагдсан мэдээлэл"}
                      onChange={({ target }) =>
                        setTdbCorporate((a) => ({
                          ...a,
                          corporateNuutsUg: target.value,
                        }))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                    label={"Гүйлгээний нууц үг"}
                    name="corporateGuilgeeniiNuutsUg"
                  >
                    <Input.Password
                      className="!pl-0"
                      placeholder={"Нууцлагдсан мэдээлэл"}
                      onChange={({ target }) =>
                        setTdbCorporate((a) => ({
                          ...a,
                          corporateGuilgeeniiNuutsUg: target.value,
                        }))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                    label="AnyBIC"
                    name="AnyBIC"
                  >
                    <Input
                      onChange={({ target }) =>
                        setTdbCorporate((a) => ({ ...a, AnyBIC: target.value }))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                    label="RoleID"
                    name="RoleID"
                  >
                    <Input
                      onChange={({ target }) =>
                        setTdbCorporate((a) => ({ ...a, RoleID: target.value }))
                      }
                    />
                  </Form.Item>
                </Form>
              </div>
              {dansGaralt?.jagsaalt
                ?.filter((a) => a.bank === "tdb")
                .map((mur) => (
                  <DansTile
                    className="box"
                    key={mur._id}
                    data={mur}
                    zasya={dansBurtgeye}
                    dansMutate={dansMutate}
                    token={token}
                  />
                ))}
              <div
                className={`flex items-center justify-end border-b border-gray-300 px-5 pb-2 pt-2 dark:border-[#4FD1C5] ${
                  !!(
                    tdbCoprporate?.corporateNevtrekhNer ||
                    tdbCoprporate?.corporateNuutsUg ||
                    tdbCoprporate?.corporateGuilgeeniiNuutsUg
                  )
                    ? "flex"
                    : "hidden"
                }`}
              >
                <Button type="primary" onClick={() => dansKhadgalya("tdb")}>
                  {"Хадгалах"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dans;
