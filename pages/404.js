import React from "react";

function Aldaa() {
  function butsakh() {
    window.history.back();
  }
  return (
    <div className=" flex h-screen w-screen items-center justify-center bg-white p-10">
      <div className="error-page flex h-screen flex-col items-center justify-center gap-10 text-center lg:flex-row lg:text-left">
        <div className="mt-10 text-[#061C3D] lg:mt-0">
          <div className="flex flex-col gap-8">
            <div>
              <div className="intro-x text-8xl font-medium">404</div>
              <div className="intro-x mt-5 text-[56px] font-medium text-[#061C3D] lg:text-3xl">
                Уучлаарай! Хуудас олдсонгүй.
              </div>
              <div className="intro-x  mt-3 text-lg text-[#061C3D]">
                Та хуудасны замыг буруу оруулсан бололтой эсвэл энэ хуудас
                устгагдсан байна.
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="intro-x btn h-[36px] w-[148px]  bg-[#4FD1C5] px-8 py-3 text-[#FFFFFF]"
                onClick={butsakh}
              >
                Буцах
              </button>
            </div>
          </div>
        </div>

        <div className="-intro-x flex h-[728px] w-[857px] items-center justify-center rounded-full bg-[#2ACBB9] p-10 lg:mr-20">
          <img
            alt="aldaa garlaa zurag"
            className="h-[341px] w-[522px] rounded-full lg:h-auto"
            src="/error.png"
          />
        </div>
      </div>
    </div>
  );
}

export default Aldaa;
