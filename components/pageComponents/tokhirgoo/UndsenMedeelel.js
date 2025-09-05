import React, { useRef, useState } from "react";
import { Input, message } from "antd";
import { url } from "services/uilchilgee";
import updateMethod from "tools/function/crud/updateMethod";
import getBase64 from "tools/function/getBase64";

const { TextArea } = Input;

function KhuviinMedeelel({
  ajiltan = {},
  token,
  ajiltanMutate,
  khadgalsniiDaraa,
  huwiinMedeelelKhadgalakh,
}) {
  const [state, setstate] = useState(ajiltan);
  const zuragRef = useRef(null);

  function onChange({ target }, key) {
    setstate((s) => ({ ...s, [key]: target.value }));
  }

  // function khadgalakh() {
  //   const { zurag, shineNuutsUg, shineNuutsUgDavtan, ...ajiltanObject } = state;
  //   if (shineNuutsUg === shineNuutsUgDavtan)
  //     ajiltanObject.nuutsUg = shineNuutsUg;

  //   updateMethod("ajiltan/ajiltan", token, ajiltanObject).then(
  //     ({ data, status }) => {
  //       if (status === 200 && "Amjilttai" === data) {
  //         message.success("Амжилттай заслаа");
  //         ajiltanMutate({ ...ajiltanObject });
  //       }
  //     }
  //   );
  // }

  function zuragSolikh({ target }) {
    getBase64(target.files[0], (base64) => (zuragRef.current.src = base64));
    setstate((s) => ({ ...s, [target.name]: target.files[0] }));
  }

  return (
    <div className="xxl:col-span-10 col-span-12 lg:col-span-10">
      <div className="intro-y box lg:mt-5">
        <div className=" flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-300 ">
            Хувийн мэдээлэл
          </h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col xl:flex-row">
            <div className="mt-6 flex-1 xl:mt-0">
              <div className="grid grid-cols-12 gap-x-5">
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label className="form-label w-[30%] text-right">
                      Овог:
                    </label>
                    <Input
                      style={{
                        width: "70%",
                        borderColor: "#4FD1C5",
                        borderWidth: 1,
                        borderRadius: "10px",
                      }}
                      name="ovog"
                      placeholder="Овог"
                      defaultValue={ajiltan.ovog}
                      onChange={(e) => onChange(e, "ovog")}
                    />
                  </div>
                </div>
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label className="form-label w-[30%] text-right">
                      Нэр:
                    </label>
                    <Input
                      style={{
                        width: "70%",
                        borderColor: "#4FD1C5",
                        borderWidth: 1,
                        borderRadius: "10px",
                      }}
                      name="ner"
                      placeholder="Нэр"
                      defaultValue={ajiltan.ner}
                      onChange={(e) => onChange(e, "ner")}
                    />
                  </div>
                </div>
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label className="form-label w-[30%] text-right">
                      Нэвтрэх нэр:
                    </label>
                    <Input
                      style={{
                        width: "70%",
                        borderColor: "#4FD1C5",
                        borderWidth: 1,
                        borderRadius: "10px",
                      }}
                      name="nevtrekhNer"
                      placeholder="Нэвтрэх нэр"
                      defaultValue={ajiltan.nevtrekhNer}
                      onChange={(e) => onChange(e, "nevtrekhNer")}
                    />
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label className="form-label w-[30%] text-right">
                      Шинэ нууц үг:
                    </label>
                    <Input.Password
                      style={{
                        width: "70%",
                        borderColor: "#4FD1C5",
                        borderWidth: 1,
                        borderRadius: "10px",
                      }}
                      className="form-control"
                      placeholder="Шинэ нууц үг"
                      name="shineNuutsUg"
                      onChange={(e) => onChange(e, "shineNuutsUg")}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label className="form-label w-[30%] text-right">
                      Шинэ нууц үг давтан:
                    </label>
                    <Input.Password
                      style={{
                        width: "70%",
                        borderColor: "#4FD1C5",
                        borderWidth: 1,
                        borderRadius: "10px",
                      }}
                      className="form-control"
                      placeholder="Шинэ нууц үг давтан"
                      name="shineNuutsUgDavtan"
                      onChange={(e) => onChange(e, "shineNuutsUgDavtan")}
                    />
                  </div>
                </div>
              </div>
              {/* <div className='flex w-full justify-end'>
                <button
                  type='button'
                  className='btn mt-3 w-20 bg-[#4FD1C5] text-white'
                  onClick={khadgalakh}>
                  Хадгалах
                </button>
              </div> */}
            </div>
            <div className="mx-auto w-52 xl:ml-6 xl:mr-0">
              <div className=" rounded-md border-2 border-dashed border-gray-200 p-5 shadow-sm">
                <div className="image-fit zoom-in relative mx-auto h-40 cursor-pointer">
                  <img
                    className="h-40 w-40 rounded-md"
                    alt="Rubick Tailwind HTML Admin Template"
                    ref={zuragRef}
                    src={
                      ajiltan?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${ajiltan?.zurgiinNer}`
                        : "/profile.svg"
                    }
                  />
                  <div className="tooltip bg-theme-6 absolute right-0 top-0 -mr-2 -mt-2 flex h-5 w-5 items-center justify-center rounded-full text-white">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-x h-4 w-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>{" "}
                  </div>
                </div>
                <div className="relative  mx-auto mt-5 cursor-pointer">
                  <button
                    type="button"
                    className="btn w-full cursor-pointer bg-[#4FD1C5] text-white"
                  >
                    Зураг солих
                  </button>
                  <input
                    type="file"
                    name="zurag"
                    className="absolute left-0 top-0 h-full w-full opacity-0"
                    onChange={zuragSolikh}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KhuviinMedeelel;
