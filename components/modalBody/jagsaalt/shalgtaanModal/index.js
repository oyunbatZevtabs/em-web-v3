import { Button } from "antd";
import { useState } from "react";
import { Modal } from "components/ant/AntdModal";
import { useRouter } from "next/router";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import { TextArea } from "components/ant/AntdInput";
import AldaaAlert from "components/alert/AldaaAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

const order = { createdAt: -1 };
const searchKeys = ["angilal"];

function ShaltgaanModal({
  guilgeeniiTuukhGaraltMutate,
  guilgeeniiToololtMutate,
  token,
  setShaltgaan,
  shaltgaan,
  setButsaahGuilgee,
  butsaahGuilgee,
}) {
  const router = useRouter();

  function onFinish() {
    var { updatedAt, ...shineData } = butsaahGuilgee;
    var yavuulakhData = { ...shineData, shaltgaan };
    if (shaltgaan.length > 0) {
      posUilchilgee(token)
        .post("/guilgeeButsaaltKhiiya", yavuulakhData)
        .then(({ data, status }) => {
          if (status === 200 && data === "Amjilttai") {
            setShaltgaan("");
            AmjilttaiAlert("Амжилттай буцаалт хийгдлээ.");
            guilgeeniiToololtMutate();
            guilgeeniiTuukhGaraltMutate();
            setButsaahGuilgee();
          } else {
            setButsaahGuilgee();
            router.push(`/khyanalt/posSystem?params=${data}`);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else {
      AnkhaaruulgaAlert("Тайлбар оруулна уу!");
    }
  }

  return (
    <Modal
      width={"438px"}
      okText="Бүртгэх"
      footer={
        <Button onClick={onFinish} type="primary">
          Буцаах
        </Button>
      }
      header={false}
      onCancel={() => setButsaahGuilgee()}
      cancelButtonProps={{ style: { display: "none" } }}
      title={<div className="text-center font-normal">Буцаалт</div>}
      open={!!butsaahGuilgee}>
      <div className="flex w-full justify-end gap-3">
        <TextArea
          value={shaltgaan}
          placeHolder="Тайлбар"
          onChange={(v) => setShaltgaan(v.target.value, "ene bol v")}
        />
      </div>
    </Modal>
  );
}

export default ShaltgaanModal;
