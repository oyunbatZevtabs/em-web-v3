import React, { useRef, useState } from "react";
import { Button, Input, message } from "antd";
import moment from "moment";
import { url } from "services/uilchilgee";
import updateMethod from "tools/function/crud/updateMethod";
import getBase64 from "tools/function/getBase64";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { useAuth } from "services/auth";

const { TextArea } = Input;

function KhuviinMedeelel({ ajiltan = {}, ajiltanMutate }) {
  const [state, setstate] = useState(ajiltan);
  const { token } = useAuth();
  const zuragRef = useRef(null);

  function onChange({ target }, key) {
    setstate((s) => ({ ...s, [key]: target.value }));
  }

  function khadgalakh() {
    const { zurag, nuutsUgDavtan, ...ajiltanObject } = state;
    if (ajiltanObject?.nuutsUg === nuutsUgDavtan) {
      setstate((prevState) => ({
        ...prevState,
        ...ajiltanObject,
      }));

      updateMethod("emZuich", token, ajiltanObject).then(({ data, status }) => {
        if (status === 200 && data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай заслаа");
          ajiltanMutate({ ...ajiltanObject });
        }
      });
    } else {
      message.error("Нууц үг буруу байна!");
    }
  }

  function zuragSolikh({ target }) {
    getBase64(target.files[0], (base64) => (zuragRef.current.src = base64));
    setstate((s) => ({ ...s, [target.name]: target.files[0] }));
  }

  return (
    <div className="col-span-9">
      <div className="intro-y box lg:mt-5">
        <div className=" flex items-center border-b border-gray-200 p-5 dark:text-gray-300">
          <h2 className="mr-auto text-base font-medium dark:text-gray-300 ">
            Хувийн мэдээлэл
          </h2>
        </div>
        <div className="h-[60vh] overflow-auto p-5">
          <div className="flex">
            <div className="mt-6 flex-1 xl:mt-0">
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Овог</label>
                    <Input
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      defaultValue={ajiltan.ovog}
                      onChange={(e) => onChange(e, "ovog")}
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Нэр</label>
                    <Input
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      defaultValue={ajiltan.ner}
                      onChange={(e) => onChange(e, "ner")}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Регистр</label>
                    <Input
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      defaultValue={ajiltan.register}
                      onChange={(e) => onChange(e, "register")}
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Ажилд орсон огноо</label>
                    <Input
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      defaultValue={moment(ajiltan.ajildOrsonOgnoo).format(
                        "YYYY-MM-DD"
                      )}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Нууц үг</label>
                    <Input.Password
                      placeholder="Нууц үг"
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      defaultValue={ajiltan.nuutsUg}
                      onChange={(e) => onChange(e, "nuutsUg")}
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Нууц үг давтан</label>
                    <Input.Password
                      onChange={(e) => onChange(e, "nuutsUgDavtan")}
                      placeholder="Нууц үг давтан"
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      defaultValue={ajiltan.nuutsUg}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-5">
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3">
                    <label className="form-label">Утасны дугаар</label>
                    <Input
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      name="utas"
                      placeholder="Input text"
                      defaultValue={ajiltan.utas}
                      onChange={(e) => onChange(e, "utas")}
                    />
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="mt-3">
                    <label className="form-label">Хаяг</label>
                    <TextArea
                      style={{
                        width: "100%",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      defaultValue={ajiltan.khayag}
                      onChange={(e) => onChange(e, "khayag")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-end">
                <Button className="mt-3" type="primary" onClick={khadgalakh}>
                  Хадгалах
                </Button>
              </div>
            </div>
            <div className="mx-auto w-52 xl:ml-6 xl:mr-0">
              <div className=" rounded-md border-2 border-dashed border-gray-200 p-5 shadow-sm">
                <div className="image-fit zoom-in relative mx-auto h-40 cursor-pointer">
                  <img
                    className="h-40 w-40 rounded-md"
                    ref={zuragRef}
                    src={
                      ajiltan?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${ajiltan?.zurgiinNer}`
                        : "/profile.svg"
                    }
                  />
                  <div className="bg-theme-6 absolute right-0 top-0 -mr-2 -mt-2 flex h-5 w-5 items-center justify-center rounded-full text-white">
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
                <div className="relative mx-auto mt-5 cursor-pointer">
                  <Button type="primary" className="btn w-full">
                    Зураг солих
                  </Button>
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
