import { Button, Input } from "antd";
import { Modal } from "components/ant/AntdModal";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import React, { useMemo, useState } from "react";
import { BiMenu } from "react-icons/bi";
const order = { createdAt: -1 };
const searchKeys = ["angilal"];

function AngilalSongokhModal({
  baiguullagiinId,
  setSongojAvsanAngilal,
  songojAvsanAngilal,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [angilalModal, setAngilal] = useState([]);

  function handleCancel() {
    setSongojAvsanAngilal([]);
    setIsModalOpen(false);
    setAngilal([]);
  }

  function onFinish() {
    setIsModalOpen(false);
    setSongojAvsanAngilal(angilalModal);
  }

  const angilalQuery = useMemo(() => {
    var qeury = {
      baiguullagiinId: baiguullagiinId,
    };
    return qeury;
  }, [baiguullagiinId]);

  const { jagsaalt: baraaniiAngilalJagsaalt, setKhuudaslalt } = posUseJagsaalt(
    "BaraaniiAngilal",
    angilalQuery,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined,
    true
  );

  function khadgalakh(angilal) {
    if (angilalModal.includes(angilal)) {
      const updatedAngilal = angilalModal.filter((item) => item !== angilal);
      setAngilal(updatedAngilal);
    } else {
      setAngilal([...angilalModal, angilal]);
    }
  }

  return (
    <>
      <div
        style={{ backgroundColor: "rgba(79, 209, 197, 0.2)" }}
        className={`flex h-[45px] w-[120px] cursor-pointer items-center justify-center gap-1 rounded-[15px] border border-teal-400 px-2 py-1 transition-all duration-300 ease-in-out hover:scale-110 `}
        onClick={() => {
          setIsModalOpen(true);
        }}>
        <div className="truncate text-center text-[15px] font-medium">Шүүх</div>
      </div>

      <Modal
        destroyOnClose={true}
        width={"838px"}
        okText="Бүртгэх"
        footer={
          <div className="flex w-full justify-end">
            <Button
              onClick={handleCancel}
              style={{ width: "186px", height: "36px" }}>
              Цуцлах
            </Button>
            <Button
              type="primary"
              onClick={onFinish}
              style={{ width: "186px", height: "36px" }}>
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">Ангилал</div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex flex-col gap-3">
          <Input
            onChange={(v) =>
              setKhuudaslalt((e) => ({
                ...e,
                khuudasniiDugaar: 1,
                search: v.target.value,
              }))
            }
            placeholder="Хайх"
            style={{
              width: "30%",
              borderColor: "#4FD1C5",
              borderRadius: "25px",
              borderWidth: 1,
            }}
          />
          <div className="flex h-[300px] w-full flex-wrap items-center justify-center gap-2 space-x-3 overflow-auto bg-white text-sm font-bold xl:h-[600px] dark:bg-gray-800 dark:text-gray-200">
            {baraaniiAngilalJagsaalt?.map((d) => {
              return (
                <div
                  style={
                    angilalModal?.some((a) => a === d.angilal)
                      ? { backgroundColor: "#4FD1C5", color: "white" }
                      : { backgroundColor: "rgba(79, 209, 197, 0.2)" }
                  }
                  onClick={() => khadgalakh(d?.angilal)}
                  className={`!m-[0] flex h-[45px] w-[180px] cursor-pointer items-center justify-center gap-1 rounded-[15px] border border-teal-400 px-2 py-1 transition-all duration-300 ease-in-out hover:scale-110 `}
                  key={d?._id}>
                  <div className="truncate text-center text-[15px]">
                    {d?.angilal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
export default AngilalSongokhModal;
