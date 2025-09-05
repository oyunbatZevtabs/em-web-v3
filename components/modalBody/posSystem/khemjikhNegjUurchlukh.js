import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState } from "react";
import { BsBoxSeam } from "react-icons/bs";
import formatNumber from "tools/function/formatNumber";
import moment from "moment";

function KhemjikhNegjUurchlukh({
  songogdsomEmnuud,
  setSongogdsomEmnuud,
  uramshuulalShalgakh,
  zadlakhToo,
  setZadlakhToo,
  data,
}) {
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (!!openModal) {
      if (!!data.zadlakhToo) {
        setZadlakhToo(data.zadlakhToo);
      }
      else if(data.shirkheg > 0 && data.shirkheglekhEsekh && data.negKhairtsaganDahiShirhegiinToo > 0) {
        setZadlakhToo(data.shirkheg * data.negKhairtsaganDahiShirhegiinToo);
      }
       else {
        setZadlakhToo("0");
      }
    }
  }, [openModal]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
      if (openModal === true) {
        if (validKeys.includes(key)) {
          if (key == ".") {
            setZadlakhToo(zadlakhToo.toString() + ".");
          } else {
            if (zadlakhToo.toString().slice(-1) === ".") {
              setZadlakhToo(zadlakhToo + key);
            } else {
              if (
                parseFloat(zadlakhToo * 10) + parseFloat(key) <
                data.negKhairtsaganDahiShirhegiinToo * data.uldegdel
              ) {
                setZadlakhToo(parseFloat(zadlakhToo * 10) + parseFloat(key));
              } else {
                setZadlakhToo(
                  parseFloat(
                    data.negKhairtsaganDahiShirhegiinToo * data.uldegdel
                  )
                );
              }
            }
          }
        }
        if (event.key === "Backspace") {
          setZadlakhToo(parseFloat(zadlakhToo.toString().slice(0, -1)) || "0");
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [zadlakhToo, data, openModal]);

  function handleCancel() {
    setZadlakhToo("0");
    setOpenModal(false);
  }

  const hylbarNemekh = (nemekhToo) => {
    if (
      parseFloat(zadlakhToo) + parseFloat(nemekhToo) <
      parseFloat(data.negKhairtsaganDahiShirhegiinToo * data.uldegdel)
    ) {
      setZadlakhToo(parseFloat(zadlakhToo) + parseFloat(nemekhToo));
    } else {
      setZadlakhToo(data.negKhairtsaganDahiShirhegiinToo * data.uldegdel);
    }
  };

  const zadlakhTooNemekh = (nemekhToo) => {
    if (nemekhToo === ".") {
      setZadlakhToo(zadlakhToo.toString() + nemekhToo.toString());
    } else {
      setZadlakhToo(parseFloat(zadlakhToo * 10) + parseFloat(nemekhToo));

      if (zadlakhToo?.toString().slice(-1) === ".") {
        setZadlakhToo(parseFloat(zadlakhToo + nemekhToo));
      } else {
        setZadlakhToo(parseFloat(zadlakhToo * 10) + parseFloat(nemekhToo));
      }
    }
  };

  useEffect(() => {
    if (!!openModal) {
      if (
        parseFloat(data.negKhairtsaganDahiShirhegiinToo) *
          parseFloat(data.uldegdel) <=
        zadlakhToo
      ) {
        setZadlakhToo(
          parseFloat(data.negKhairtsaganDahiShirhegiinToo) *
            parseFloat(data.uldegdel)
        );
      }
    }
  }, [openModal, zadlakhToo]);

  function onFinish() {
    addInputValue(
      data,
      undefined,
      zadlakhToo,
      parseFloat(zadlakhToo) / parseFloat(data.negKhairtsaganDahiShirhegiinToo)
    );

    // setZadlakhToo("0");
    setOpenModal(false);
  }

  function addInputValue(
    mur,
    value,
    functionDotorAshiglakhShirkheg,
    zadlakhTooButarhai
  ) {
    const updatedSongogdsomEmnuud = songogdsomEmnuud;
    if (mur.shirkheglekhEsekh && !!value) {
      setZadlakhToo(
        parseFloat(value) * parseFloat(mur?.negKhairtsaganDahiShirhegiinToo)
      );
    }
    var uramshuulaliinToo = 0;
    for (const el of updatedSongogdsomEmnuud) {
      if (el._id === mur._id) {
        if (el.uramshuulal.length > 0) {
          uramshuulaliinToo = uramshuulaliinToo + 1;
        }
        mur.zarakhTsuvral = [];
        var too = 0;
        if (zadlakhTooButarhai != 0 && !!zadlakhTooButarhai) {
          too = parseFloat(zadlakhTooButarhai);
          value = parseFloat(zadlakhTooButarhai);
        }
        if (value != 0 && !!value) {
          too = value;
        }
        var filterlsen = el.tsuvral?.filter(
          (a) => parseFloat(a.uldegdel) > 0 && a.uldegdel != null
        );
        var sortolson = filterlsen.sort((a, b) =>
          moment(a?.duusakhOgnoo || a?.huleejAvsanOgnoo).isBefore(
            moment(b?.duusakhOgnoo || b?.huleejAvsanOgnoo)
          )
            ? -1
            : 1
        );

        el.zadlakhToo =
          mur.shirkheglekhEsekh && openModal
            ? functionDotorAshiglakhShirkheg
            : value * mur?.negKhairtsaganDahiShirhegiinToo;
        el.zadlakhTooButarhai = zadlakhTooButarhai;
        el.shirkheg =
          zadlakhTooButarhai !== 0 && !!zadlakhTooButarhai
            ? parseFloat(zadlakhTooButarhai)
            : value != 0 && !!value
            ? value
            : 0;
        
        el.zarsanNiitUne =
          functionDotorAshiglakhShirkheg != "0" &&
          !!functionDotorAshiglakhShirkheg
            ? el.khunglukhEsekh === true
              ? parseFloat(mur.niitUne) *
                  parseFloat(value || 1) -
                functionDotorAshiglakhShirkheg * el.emiinShirkhegiinKhunglukhDun
              : (parseFloat(mur.niitUne) /
                  parseFloat(mur.negKhairtsaganDahiShirhegiinToo || 1)) *
                parseFloat(functionDotorAshiglakhShirkheg || 1)
            : value <= mur.uldegdel
            ? value * el.niitUne - (value * (el.khunglukhEsekh === true ? el.emiinShirkhegiinKhunglukhDun : 0)) 
            : mur.uldegdel * el.niitUne - (mur.uldegdel * (el.khunglukhEsekh === true ? el.emiinShirkhegiinKhunglukhDun : 0));

        el.hungulsunDun =
          value <= mur.uldegdel && el.khunglukhEsekh
            ? mur.shirkheglekhEsekh
              ? functionDotorAshiglakhShirkheg * el.emiinShirkhegiinKhunglukhDun
              : value * el.emiinShirkhegiinKhunglukhDun
            : mur.uldegdel * el.emiinShirkhegiinKhunglukhDun;
        
        sortolson.forEach((element) => {
          if (too > 0) {
            const { uldegdel, ...tsuvral } = element;
            var shineTsuvral = { ...tsuvral };
            if (element.uldegdel >= too) {
              shineTsuvral.too = Number(too).toFixed(2);
              too = Number(too).toFixed(2) - Number(too).toFixed(2);
            } else {
              too =
                Number(too).toFixed(2) - Number(element.uldegdel).toFixed(2);
              shineTsuvral.too = Number(element.uldegdel).toFixed(2);
            }
            if (element.uldegdel != 0) mur.zarakhTsuvral.push(shineTsuvral);
            mur.shirkheg = value;
          }
          el.tsuvral.forEach((data) => {
            var oldson = mur.zarakhTsuvral.find((a) => a._id === data._id);
            if (!!oldson) {
              data.too = Number(oldson?.too).toFixed(2);
            }
          });
        });
        el.zarakhTsuvral = mur.zarakhTsuvral;
      }
    }
    if (uramshuulaliinToo > 0) {
      uramshuulalShalgakh(updatedSongogdsomEmnuud);
    } else setSongogdsomEmnuud([...updatedSongogdsomEmnuud]);
  }

  return (
    <>
      <div
        className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[10px] border-[1px] border-white bg-[#4FD1C5] duration-300 hover:opacity-40 xl:h-[40px] xl:w-[40px]"
        onClick={() => setOpenModal(true)}>
        <BsBoxSeam
          // style={{
          //   fontSize: "25px",
          // }}
          className="cursor-pointer !text-[10px] text-white xl:!text-[25px]"
        />
      </div>
      <Modal
        open={openModal}
        destroyOnClose={true}
        width={"538px"}
        okText="Бүртгэх"
        footer={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Хэмжих нэгж өөрчлөх
          </div>
        }
        onCancel={handleCancel}>
        <div className="mb-4 flex gap-[4px] dark:text-gray-200">
          <div className="font-semibold">Нэг хайрцаг дахь ширхэг:</div>
          <div className="font-semibold ">
            {data.negKhairtsaganDahiShirhegiinToo}ш
          </div>
        </div>
        <div className="mb-4 flex gap-[4px] dark:text-gray-200">
          <div className="font-semibold">Агуулхад байгаа ширхэг:</div>
          <div className="font-semibold ">
            {formatNumber(
              data.negKhairtsaganDahiShirhegiinToo * data.uldegdel,
              2
            )}
            ш
          </div>
        </div>
        <div className="flex h-[491px] flex-col items-center justify-center gap-4 ">
          <div className="flex h-[53px] w-[359px] cursor-pointer items-center justify-center rounded-full  border-[1px] border-[#4FD1C5]">
            <div className="truncate text-[32px] font-bold text-[#00A35E]">
              {/* {zadlakhToo != "0" ? zadlakhToo : data.zadlakhToo || 0.0} */}
              {Number(zadlakhToo || 0).toFixed(2)}
            </div>
          </div>
          <div className="flex h-full w-[100%] flex-col items-center gap-5 dark:text-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div
                onClick={() => zadlakhTooNemekh("1")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                1
              </div>
              <div
                onClick={() => zadlakhTooNemekh("2")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                2
              </div>
              <div
                onClick={() => zadlakhTooNemekh("3")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                3
              </div>
              <div
                onClick={() => hylbarNemekh("5")}
                style={{
                  backgroundColor: "rgba(0, 255, 231, 0.1)",
                }}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                +5
              </div>
              <div
                onClick={() => zadlakhTooNemekh("4")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                4
              </div>
              <div
                onClick={() => zadlakhTooNemekh("5")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                5
              </div>
              <div
                onClick={() => zadlakhTooNemekh("6")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                6
              </div>
              <div
                onClick={() => hylbarNemekh("10")}
                style={{
                  backgroundColor: "rgba(0, 255, 231, 0.1)",
                }}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                +10
              </div>
              <div
                onClick={() => zadlakhTooNemekh("7")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                7
              </div>
              <div
                onClick={() => zadlakhTooNemekh("8")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                8
              </div>
              <div
                onClick={() => zadlakhTooNemekh("9")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                9
              </div>
              <div
                onClick={() =>
                  setZadlakhToo(
                    zadlakhToo == "0" ? "0" : parseFloat(zadlakhToo) - 1
                  )
                }
                style={{
                  backgroundColor: "rgba(0, 255, 231, 0.1)",
                }}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                -
              </div>
              <div
                onClick={() => zadlakhTooNemekh(".")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                .
              </div>
              <div
                onClick={() => zadlakhTooNemekh("0")}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                0
              </div>
              <div
                onClick={() =>
                  setZadlakhToo(
                    parseFloat(zadlakhToo.toString().slice(0, -1)) || "0"
                  )
                }
                style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#FF4646]">
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
                onClick={() => hylbarNemekh(1)}
                style={{
                  backgroundColor: "rgba(0, 255, 231, 0.1)",
                }}
                className="flex h-[70px] w-[20%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white">
                +
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <button
              style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
              type="primary"
              className="flex h-12 w-[186px] items-center justify-center rounded-2xl border-[1px] border-[#FF4646] bg-red-400 text-xl font-[600] text-white  shadow-md"
              onClick={() => handleCancel()}>
              <div className="text-[15px] text-[#FF4646]">Цуцлах [ESC]</div>
            </button>
            <button
              onClick={onFinish}
              type="primary"
              className="flex h-12 w-[186px] items-center justify-center rounded-2xl bg-[#4FD1C5] text-[15px]  font-[600] text-white shadow-xl">
              Хадгалах
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default KhemjikhNegjUurchlukh;
