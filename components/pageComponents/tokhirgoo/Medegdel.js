import React, { useEffect, useState } from "react";
import { Button, notification } from "antd";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import uilchilgee from "services/uilchilgee";
import { Input } from "components/ant/AntdInput";

function Medegdel({
  baiguullaga,
  token,
  baiguullagaMutate,
  tokhirgooModalKhaayaa,
}) {
  const [smsTokhirgoo, setSmsTokhirgoo] = useState({
    msgIlgeekhKey: baiguullaga?.tokhirgoo?.SMS?.msgIlgeekhKey || undefined,
    msgIlgeekhDugaar:
      baiguullaga?.tokhirgoo?.SMS?.msgIlgeekhDugaar || undefined,
  });
  const [emailTokhirgoo, setEmailTokhirgoo] = useState({
    mailNevtrekhNer: baiguullaga?.tokhirgoo?.email?.mailNevtrekhNer || "",
    mailPassword: baiguullaga?.tokhirgoo?.email?.mailPassword || "",
    mailHost: baiguullaga?.tokhirgoo?.email?.mailHost || "",
    mailPort: baiguullaga?.tokhirgoo?.email?.mailPort || "",
  });

  useEffect(() => {
    if (baiguullaga) {
      setEmailTokhirgoo({
        mailNevtrekhNer: baiguullaga?.tokhirgoo?.email?.mailNevtrekhNer || "",
        mailPassword: baiguullaga?.tokhirgoo?.email?.mailPassword || "",
        mailHost: baiguullaga?.tokhirgoo?.email?.mailHost || "",
        mailPort: baiguullaga?.tokhirgoo?.email?.mailPort || "",
      });
      setSmsTokhirgoo({
        msgIlgeekhKey: baiguullaga?.tokhirgoo?.SMS?.msgIlgeekhKey || undefined,
        msgIlgeekhDugaar:
          baiguullaga?.tokhirgoo?.SMS?.msgIlgeekhDugaar || undefined,
      });
    }
  }, [baiguullaga]);

  function smsEmailTokhirgooKhadgalya() {
    if (!baiguullaga) {
      return notification.warn({ message: "Та дахин оролдоно уу." });
    }
    if (!smsTokhirgoo) {
      return notification.warn({ message: "Тохиргоо өөрчлөгдөөгүй байна." });
    } else {
      const yavuulakhData = {
        id: baiguullaga._id,
        msgIlgeekhKey: smsTokhirgoo.msgIlgeekhKey,
        msgIlgeekhDugaar: smsTokhirgoo.msgIlgeekhDugaar,
        mailNevtrekhNer: emailTokhirgoo.mailNevtrekhNer,
        mailPassword: emailTokhirgoo.mailPassword,
        mailHost: emailTokhirgoo.mailHost,
        mailPort: emailTokhirgoo.mailPort,
      };
      uilchilgee(token)
        .post("/smsTokhirgooOruulyaa", yavuulakhData)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгаллаа");
            baiguullagaMutate();
            tokhirgooModalKhaayaa();
          }
        });
    }
  }

  return (
    <div className="xxl:col-span-9 col-span-12 lg:col-span-8">
      <div className="intro-y box lg:mt-5">
        <div className=" flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto w-1/2 text-base font-medium dark:text-gray-50">
            СМС Тохиргоо
          </h2>
          <h2 className="w-1/2 pl-5 text-base font-medium dark:text-gray-50 ">
            И-мэйл Тохиргоо
          </h2>
        </div>
        <div className="flex w-[100%]">
          <div className="w-1/2">
            <div className="box">
              <div className="flex items-center gap-2 p-5">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="font-medium">{"СМС илгээх түлхүүр"}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Input
                    value={smsTokhirgoo?.msgIlgeekhKey}
                    onChange={({ target }) =>
                      setSmsTokhirgoo((a) => ({
                        ...(a || {}),
                        msgIlgeekhKey: target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="box">
              <div className="flex items-center gap-2 p-5">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="font-medium">{"СМС илгээх дугаар"}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Input
                    value={smsTokhirgoo?.msgIlgeekhDugaar}
                    onChange={({ target }) =>
                      setSmsTokhirgoo((a) => ({
                        ...(a || {}),
                        msgIlgeekhDugaar: target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <div className="box">
              <div className="flex items-center gap-2 p-5">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="font-medium">{"И-мэйл нэвтрэх нэр"}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Input
                    value={emailTokhirgoo?.mailNevtrekhNer}
                    onChange={({ target }) =>
                      setEmailTokhirgoo((a) => ({
                        ...(a || {}),
                        mailNevtrekhNer: target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="box">
              <div className="flex items-center gap-2 p-5">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="font-medium">{"И-мэйл нууц үг"}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Input
                    value={emailTokhirgoo?.mailPassword}
                    onChange={({ target }) =>
                      setEmailTokhirgoo((a) => ({
                        ...(a || {}),
                        mailPassword: target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="box">
              <div className="flex items-center gap-2 p-5">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="font-medium">{"И-мэйл хост"}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Input
                    value={emailTokhirgoo?.mailHost}
                    onChange={({ target }) =>
                      setEmailTokhirgoo((a) => ({
                        ...(a || {}),
                        mailHost: target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="box">
              <div className="flex items-center gap-2 p-5">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="font-medium">{"СМС илгээх дугаар"}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Input
                    value={emailTokhirgoo?.mailPort}
                    onChange={({ target }) =>
                      setEmailTokhirgoo((a) => ({
                        ...(a || {}),
                        mailPort: target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={smsEmailTokhirgooKhadgalya}
            type="primary"
            className="btn btn-primary mt-4"
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Medegdel;
