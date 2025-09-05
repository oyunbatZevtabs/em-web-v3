import { Button } from "antd";
import { Modal } from "components/ant/AntdModal";
import {
  ActionContent,
  ItemColumnCentered,
} from "components/swipeableItem/styledComponents";
import React, { useState } from "react";
import { SwipeAction } from "react-swipeable-list";
import { ImPriceTags } from "react-icons/im";

function KhemjikhNegj({ data, songogdsomEmnuud, setSongogdsomEmnuud }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orjIrsenDatagShirkhegBolgoy, setOrjIrsenDatagShirkhegBolgoy] =
    useState({ ...data, zadalsanKhairtsagniiShirkheg: 0 });

  const shirkhegBodokh = (value) => {
    const parsedValue = parseInt(value);
    if (
      parsedValue >= 0 &&
      orjIrsenDatagShirkhegBolgoy?.zadalsanKhairtsagniiShirkheg + parsedValue <=
        orjIrsenDatagShirkhegBolgoy.uldegdel
    ) {
      setOrjIrsenDatagShirkhegBolgoy((prevState) => ({
        ...prevState,
        zadalsanKhairtsagniiShirkheg:
          prevState.zadalsanKhairtsagniiShirkheg + parsedValue,
      }));
    }
  };

  const onFinish = () => {
    var shineJagsaalt = songogdsomEmnuud.filter(
      (a) => a._id !== orjIrsenDatagShirkhegBolgoy._id
    );
    shineJagsaalt.push(orjIrsenDatagShirkhegBolgoy);
    setSongogdsomEmnuud(shineJagsaalt);
    handleCancel();
  };
  function handleCancel() {
    setIsModalOpen(false);
    setOrjIrsenDatagShirkhegBolgoy({
      ...data,
      zadalsanKhairtsagniiShirkheg: 0,
    });
  }

  return (
    <>
      <SwipeAction destructive={false} onClick={() => setIsModalOpen(true)}>
        <ActionContent
          style={{
            displayflex: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4FD1C5",
            marginLeft: "5px",
            borderRadius: "1rem",
          }}>
          <ItemColumnCentered>
            <span className="testicon flex items-center justify-center">
              <ImPriceTags style={{ color: "black", fontSize: "25px" }} />
            </span>
          </ItemColumnCentered>
        </ActionContent>
      </SwipeAction>
      <Modal
        width={"538px"}
        okText="Бүртгэх"
        footer={
          <div className="flex w-full justify-evenly">
            <Button style={{ width: "186px", height: "36px" }} type="danger">
              Цуцлах [ESC]
            </Button>
            <Button
              onClick={onFinish}
              style={{ width: "186px", height: "36px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Хэмжих нэгж өөрчлөх
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex w-full flex-col gap-[60px]  pb-0">
          <div className="flex justify-center gap-4 ">
            <div className="flex h-full flex-col items-center gap-5">
              <div className="flex h-[53px] w-[359px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5]">
                <div className="font-bold">
                  {orjIrsenDatagShirkhegBolgoy?.zadalsanKhairtsagniiShirkheg}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div
                  onClick={() => shirkhegBodokh("1")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  1
                </div>
                <div
                  onClick={() => shirkhegBodokh("2")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  2
                </div>
                <div
                  onClick={() => shirkhegBodokh("3")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  3
                </div>
                <div
                  style={{ backgroundColor: "rgba(0, 255, 231, 0.1)" }}
                  onClick={() => shirkhegBodokh("5")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  +5
                </div>
                <div
                  onClick={() => shirkhegBodokh("4")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  4
                </div>
                <div
                  onClick={() => shirkhegBodokh("5")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  5
                </div>
                <div
                  onClick={() => shirkhegBodokh("6")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  6
                </div>
                <div
                  style={{ backgroundColor: "rgba(0, 255, 231, 0.1)" }}
                  onClick={() => shirkhegBodokh("10")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  +10
                </div>
                <div
                  onClick={() => shirkhegBodokh("7")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  7
                </div>
                <div
                  onClick={() => shirkhegBodokh("8")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  8
                </div>
                <div
                  onClick={() => shirkhegBodokh("9")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  9
                </div>
                <div
                  style={{ backgroundColor: "rgba(0, 255, 231, 0.1)" }}
                  onClick={() => shirkhegBodokh("-")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  -
                </div>
                <div
                  onClick={() =>
                    setTurul((prevTurul) =>
                      prevTurul.map((item) =>
                        item.turul === tulburiinHelber
                          ? { ...item, une: "" }
                          : item
                      )
                    )
                  }
                  style={{ backgroundColor: "rgba(255, 92, 0, 0.1)" }}
                  className="flex h-[70px] w-[20%] items-center justify-center rounded-3xl border-[2px] border-[#FF5C00] text-[32px] font-bold text-[#FF5C00]">
                  <svg
                    width="19"
                    height="24"
                    viewBox="0 0 19 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.08 1.688C17.6347 1.96533 17.9547 2.40267 18.04 3C18.1467 3.59733 17.9973 4.14133 17.592 4.632C17.3147 5.016 16.952 5.22933 16.504 5.272C16.0773 5.31467 15.64 5.22933 15.192 5.016C14.68 4.78133 14.136 4.6 13.56 4.472C13.0053 4.344 12.4187 4.28 11.8 4.28C10.648 4.28 9.61333 4.46133 8.696 4.824C7.8 5.18667 7.032 5.70933 6.392 6.392C5.752 7.05333 5.26133 7.84267 4.92 8.76C4.6 9.67733 4.44 10.6907 4.44 11.8C4.44 13.1013 4.62133 14.232 4.984 15.192C5.368 16.152 5.89067 16.952 6.552 17.592C7.21333 18.232 7.992 18.712 8.888 19.032C9.784 19.3307 10.7547 19.48 11.8 19.48C12.376 19.48 12.952 19.4267 13.528 19.32C14.104 19.2133 14.6587 19.0213 15.192 18.744C15.64 18.5307 16.0773 18.456 16.504 18.52C16.952 18.584 17.3253 18.808 17.624 19.192C18.0507 19.7253 18.2 20.28 18.072 20.856C17.9653 21.4107 17.6453 21.816 17.112 22.072C16.5573 22.3493 15.9813 22.584 15.384 22.776C14.808 22.9467 14.2213 23.0747 13.624 23.16C13.0267 23.2667 12.4187 23.32 11.8 23.32C10.264 23.32 8.80267 23.0747 7.416 22.584C6.05067 22.0933 4.824 21.368 3.736 20.408C2.66933 19.448 1.82667 18.2533 1.208 16.824C0.589333 15.3733 0.28 13.6987 0.28 11.8C0.28 10.1573 0.557333 8.64267 1.112 7.256C1.688 5.86933 2.488 4.67467 3.512 3.672C4.55733 2.648 5.784 1.85867 7.192 1.304C8.6 0.727999 10.136 0.439999 11.8 0.439999C12.7387 0.439999 13.656 0.546665 14.552 0.759998C15.448 0.973331 16.2907 1.28267 17.08 1.688Z"
                      fill="#FF5C00"
                    />
                  </svg>
                </div>
                <div
                  onClick={() => mungunDunNemekh("0")}
                  className="flex h-[70px] w-[20%] items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold">
                  0
                </div>
                <div
                  onClick={() =>
                    setTurul((prevTurul) =>
                      prevTurul.map((item) =>
                        item.turul === tulburiinHelber
                          ? { ...item, une: item.une.slice(0, -1) }
                          : item
                      )
                    )
                  }
                  style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
                  className="flex h-[70px] w-[20%] items-center justify-center rounded-3xl border-[2px] border-[#FF4646]">
                  <svg
                    width="37"
                    height="23"
                    viewBox="0 0 37 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M32.6873 7.31748e-08H11.6484C11.1714 -9.63208e-05 10.699 0.0950439 10.2583 0.279982C9.81763 0.46492 9.41722 0.73603 9.08002 1.07781L0.532016 9.73594C-0.177339 10.4545 -0.177339 11.6191 0.532016 12.3371L9.08002 20.9958C9.761 21.6856 10.6849 22.0736 11.6479 22.0736H32.6873C34.6934 22.0736 36.3192 20.4267 36.3192 18.3946V3.67893C36.3192 1.6469 34.6934 7.31748e-08 32.6873 7.31748e-08ZM27.8813 14.6042C28.236 14.9635 28.236 15.5458 27.8813 15.905L26.5977 17.2053C26.243 17.5646 25.6681 17.5646 25.3134 17.2053L21.7916 13.6379L18.2698 17.2053C17.9152 17.5646 17.3403 17.5646 16.9856 17.2053L15.702 15.905C15.3473 15.5458 15.3473 14.9635 15.702 14.6042L19.2238 11.0368L15.702 7.46938C15.3473 7.11011 15.3473 6.5278 15.702 6.16853L16.9856 4.86826C17.3403 4.50899 17.9152 4.50899 18.2698 4.86826L21.7916 8.43567L25.3134 4.86826C25.6681 4.50899 26.243 4.50899 26.5977 4.86826L27.8813 6.16853C28.236 6.5278 28.236 7.11011 27.8813 7.46938L24.3595 11.0368L27.8813 14.6042Z"
                      fill="#FF4646"
                    />
                  </svg>
                </div>
                <div
                  style={{ backgroundColor: "rgba(0, 255, 231, 0.1)" }}
                  onClick={() => shirkhegBodokh("+")}
                  className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default KhemjikhNegj;
