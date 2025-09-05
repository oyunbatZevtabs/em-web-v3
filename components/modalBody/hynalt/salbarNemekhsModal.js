import { Button, Modal } from "antd";
import React, { useRef, useState } from "react";
import BaiguullagaBurtgelForm from "./BaiguullagaBurtgelForm";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { EyeOutlined, FormOutlined } from "@ant-design/icons";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";

function BaiguullagaBurtgelAlkham({
  token,
  mutate,
  readonly,
  ugugdul,
  baiguullagiinId,
  salbariinId,
}) {
  const baiguullagaBurtgelRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  function khadgalya() {
    const utguud = baiguullagaBurtgelRef.current.burtgelAvya();
    if (!!utguud && !ugugdul) {
      utguud["baiguullagiinId"] = baiguullagiinId;
      utguud["salbariinId"] = salbariinId;
      uilchilgee(token)
        .post("/emiinSanSalbarBurtgeye", utguud)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгалагдлаа");
            mutate();
            setModalIsOpen(false);
          }
        })
        .catch((err) => {
          aldaaBarigch(err);
        });
    }
    if (!!utguud && !!ugugdul) {
      const yavakhData = { _id: ugugdul?._id, ...utguud };
      uilchilgee(token)
        .post(`/emiinSanSalbarBurtgeye/`, yavakhData)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгалагдлаа");
            mutate();
            setModalIsOpen(false);
          }
        })
        .catch((err) => {
          aldaaBarigch(err);
        });
    }
  }

  return (
    <>
      {!readonly && !ugugdul ? (
        <Button onClick={() => setModalIsOpen(true)} type="primary">
          Нэмэх
        </Button>
      ) : readonly ? (
        <div
          className="flex cursor-pointer flex-col items-center justify-center leading-3"
          onClick={() => setModalIsOpen(true)}>
          <MdRemoveRedEye style={{ fontSize: "18px", color: "#4fc1d5" }} />
          <div className="text-[#4fc1d5]">Харах</div>
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col dark:text-gray-200 items-center justify-center leading-3"
          onClick={() => setModalIsOpen(true)}>
          <MdEdit style={{ fontSize: "18px", color: "#2D3748" }} />
          <div className="text-[#2D3748] dark:text-gray-200">Засах</div>
        </div>
      )}
      <Modal
        destroyOnClose={true}
        width={"720px"}
        okText="Бүртгэх"
        // title='Салбар Бүртгэл'
        title={<div className="text-center dark:text-gray-200">Салбар бүртгэл</div>}
        footer={false}
        cancelButtonProps={{ style: { display: "none" } }}
        open={modalIsOpen}
        onCancel={() => setModalIsOpen(false)}>
        <BaiguullagaBurtgelForm
          readonly={readonly}
          ref={baiguullagaBurtgelRef}
          ugugdul={ugugdul}
        />
        {!readonly && (
          <div className="mt-2 flex w-full justify-end">
            <Button
              onClick={khadgalya}
              style={{ margin: "0 8px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}

export default BaiguullagaBurtgelAlkham;
