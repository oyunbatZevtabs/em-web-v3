import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Switch } from "antd";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { Modal } from "components/ant/AntdModal";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { tsonkhnuud } from "tools/logic/khereglegchiinErkhiinTokhirgoo";

function ErkhiinTokhirgooModal({ data, token, mutate }) {
  const [emchiinErkhModalOpen, setemchiinErkhModalOpen] = useState(false);
  const [adminEsekh, setAdminEsekh] = useState(false);

  const { baiguullaga } = useAuth();
  const [tsonkhniiErkh, setTsonkhniiErkh] = useState(
    data?.tsonkhniiTokhirgoo || {}
  );
  const [salbariinErkh, setSalbariinErkh] = useState(data?.salbaruud || []);

  useEffect(() => {
    if (!!data.AdminEsekh === true) {
      setAdminEsekh(true);
    } else setAdminEsekh(false);
  }, [data, emchiinErkhModalOpen]);

  const showModal = () => {
    setemchiinErkhModalOpen(true);
  };

  const handleCancel = () => {
    setemchiinErkhModalOpen(false);
  };

  function khadgalya() {
    if (!tsonkhniiErkh || tsonkhniiErkh.length <= 0) {
      return AnkhaaruulgaAlert("Цонхны эрх хоосон байна");
    }
    // if (!salbariinErkh || salbariinErkh.length <= 0) {
    // return AnkhaaruulgaAlert("Салбарын эрх хоосон байна")
    // }
    uilchilgee(token)
      .post("/emZuichidErkhUgyuu", {
        ajiltaniiId: data?._id,
        tsonkhniiTokhirgoo: tsonkhniiErkh,
        salbaruud: salbariinErkh,
        adminEsekh: adminEsekh,
      })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай хадгалагдлаа");
          mutate();
          setemchiinErkhModalOpen(false);
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
      });
  }

  function salbarOnchange(value, id) {
    var shineSalbaruud = [];
    if (value === true) {
      salbariinErkh?.push(id);
      shineSalbaruud = salbariinErkh;
    } else shineSalbaruud = salbariinErkh?.filter((a) => a !== id);

    setSalbariinErkh(shineSalbaruud || []);
  }

  return (
    <div>
      <div
        onClick={showModal}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 transition-colors duration-500 hover:bg-teal-200 dark:text-gray-200">
        <SettingOutlined />
        <div>Эрх</div>
      </div>
      <Modal
        bodyStyle={{
          backgroundColor: "#E2E8F0",
          borderRadius: "50%",
        }}
        title=""
        okText="Бүртгэх"
        footer={false}
        cancelButtonProps={{ style: { display: "none" } }}
        width={1300}
        open={emchiinErkhModalOpen}
        onCancel={handleCancel}>
        <div className="relative my-11 h-[100%] w-[100%] items-end justify-center rounded-2xl ">
          <div
            style={{
              backgroundImage: `url("/image_2023-09-05_15-15-38.png")`,
              backgroundPosition: "35% 20%",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            className="relative flex h-[150px] w-[100%] items-end justify-center rounded-2xl bg-[#4FD1C5] dark:bg-gray-800">
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.8 )",
              }}
              className="absolute bottom-[-25%] flex h-[65%] w-[95%] items-center rounded-xl border-2 border-[white] px-11 dark:bg-gray-800">
              <div className="flex h-[60px] items-center gap-2 rounded-xl ">
                <div className="relative h-[100%] w-[60px] rounded-xl bg-black dark:bg-gray-800">
                  <div className="absolute bottom-[-5%] right-[-5%] h-[23px] w-[23px] rounded-[7px] bg-[white] dark:bg-gray-400">
                    <EditOutlined fill="#4FD1C5" className="text-[#4FD1C5]" />
                  </div>
                </div>
                <div>
                  <div className="text-[#718096]">
                    {`${data?.ovog ? data?.ovog?.[0].toUpperCase() + "." : ""}${
                      data?.ner
                    }` || "Нэр"}
                  </div>
                  <div className="text-[#A0AEC0] dark:text-gray-800">{data?.mail || "Email"}</div>
                </div>
              </div>
              <div className="flex w-full justify-end gap-2">
                <Switch
                  checked={adminEsekh}
                  onChange={(v) => {
                    setAdminEsekh(v);
                  }}
                />
                <p className="text-[#718096]">Админ эсэх</p>
              </div>
            </div>
          </div>
          <div className="mx-8 mt-11 flex justify-center gap-11">
            <div className="flex h-[420px] w-[517px] flex-col rounded-xl bg-[white] p-9 dark:bg-gray-800 dark:text-gray-200">
              <p className="text-lg font-bold">Профайл мэдээлэл</p>
              {/* <p className="text-[#A0AEC0]">
                Сайн уу, Шийдвэрүүд: Хэрэв та шийдэж чадахгүй бол хариулт нь
                үгүй. Хэрэв хоёр ижил хэцүү зам байвал богино хугацаанд илүү
                зовлонтой замыг сонго (өвдөлтөөс зайлсхийх нь тэгш байдлын
                хуурмаг байдлыг бий болгодог).
              </p> */}
              <div className="flex justify-between">
                <p className="text-[#718096]">Овог:</p>
                <p>{data?.ovog}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#718096]">Нэр:</p>
                <p>{data?.ner}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#718096]">Утас:</p>
                <p>{data?.utas}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#718096]">И-Мэйл:</p>
                <p>{data?.mail}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#718096]">Хаяг:</p>
                <p>{data?.khayag}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#718096]">Сошиал хаяг:</p>
                <p></p>
              </div>
            </div>

            <div
              className={`flex justify-between overflow-hidden rounded-xl bg-[white] transition-all dark:text-gray-200 dark:bg-gray-800  ${
                !adminEsekh ? "h-[480px]  w-[646px] p-9" : "h-[420px] w-[2px]"
              }`}>
              <div className="flex flex-col gap-5 px-5 dark:text-gray-200 dark:bg-gray-800">
                <div className="flex w-full justify-between">
                  <p className="text-lg font-bold">Эрхийн тохиргоо</p>
                </div>
                <div className="flex flex-col gap-1 overflow-auto">
                  {tsonkhnuud?.map((mur) => (
                    <div key={mur.key} className="flex gap-2">
                      <Switch
                        defaultChecked={
                          data?.tsonkhniiTokhirgoo?.[mur.name] || undefined
                        }
                        onChange={(v) => {
                          setTsonkhniiErkh((e) => ({
                            ...e,
                            [mur.name]: v,
                          }));
                        }}
                      />
                      <p className="text-[#718096]">{mur?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-14 flex flex-col gap-5 overflow-auto">
                {baiguullaga?.salbaruud?.map((mur, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-[#718096]">{mur?.ner}</p>
                      <Switch
                        checked={salbariinErkh?.find((a) => a === mur._id)}
                        onChange={(v) => salbarOnchange(v, mur._id)}
                      />
                    </div>
                    <div className="h-[90px] w-[188px] rounded-2xl bg-yellow-600"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button onClick={khadgalya} type="primary">
            Хадгалах
          </Button>
        </div>
      </Modal>
    </div>
  );
}
export default ErkhiinTokhirgooModal;
