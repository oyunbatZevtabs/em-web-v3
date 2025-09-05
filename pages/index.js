import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Switch } from "antd";

import Head from "next/head";
import moment from "moment";
import { useAuth } from "../services/auth";
import { destroyCookie } from "nookies";
import AOS from "aos";
import Image from "next/image";
import { useTheme } from "next-themes";
import Snowfall from "react-snowfall";
import { parseCookies } from "nookies";
// import loginImg from "../public/LOGIN.png";

const { Password } = Input;

export function useThemeValue() {
  const { theme, setTheme } = useTheme();
  const [themeValue, setThemeValue] = useState(false);
  useEffect(() => {
    setThemeValue(theme === "dark");
  }, [theme]);
  return { themeValue, setTheme };
}

function Ajiltan() {
  const [form] = Form.useForm();

  const { newterya } = useAuth();

  useEffect(async () => {
    const nevtrekhNer = await localStorage.getItem("newtrekhNerTurees");
    form.setFieldsValue({ nevtrekhNer });
  }, []);
  useEffect(() => {
    AOS.init();
  });
  const images = [];
  if (typeof window !== "undefined") {
    const snowflake1 = document.createElement("img");
    snowflake1.src = "/snowflake.png";
    const snowflake2 = document.createElement("img");
    snowflake2.src = "/snowflake1.png";
    const snowflake3 = document.createElement("img");
    snowflake2.src = "/snowflake2.png";
    images.push(snowflake3);
    images.push(snowflake1);
    images.push(snowflake2);
  }

  return (
    <div className="flex h-screen w-screen scale-x-100 items-center justify-center bg-[#91cec8] dark:bg-gray-900">
      {moment(new Date()).format("MM") === "12" ? (
        <Snowfall radius={[10, 30]} snowflakeCount={250} images={images} />
      ) : null}
      <div
        className="mx-2 flex h-[750px] w-[1318px] rounded-3xl bg-[#FFFFFF] py-10 dark:bg-gray-800 dark:text-gray-50"
        // style={{
        //   backgroundImage: `url("/image17.png")`,
        //   backgroundSize: "1318px 750px",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center",
        // }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex h-[45%] w-[70%] flex-col items-center justify-center gap-8 ">
            <div className="flex h-[60%] w-[80%] items-center justify-center rounded-[47px]">
              <Image width={190} height={190} src={"/logo.png"} />
            </div>
            <p className="w-[90%] text-[15px] font-[500] leading-[18.75px] text-[#293050] dark:text-gray-50">
              Дэвшилтэд технологи ашиглан таны бизнесийн ашгийг нэмэгдүүлж,
              хяналтыг сайжруулна.
            </p>
          </div>
          <div className="flex h-[40%] w-[70%] flex-col items-center justify-center gap-2 ">
            <Form
              onFinish={newterya}
              form={form}
              initialValues={{}}
              data-aos="fade-right"
              className="flex !w-[90%] flex-col items-start justify-center"
            >
              <Form.Item
                className="w-[90%]"
                labelCol={{ span: 24 }}
                name="burtgeliinDugaar"
                label={
                  <div className="text-[15px] font-[500] text-[#293050] dark:text-gray-50">
                    Нэвтрэх нэр
                  </div>
                }
              >
                <Input
                  placeholder="Нэвтрэх нэр"
                  className="login-input !w-full !rounded-full !py-3"
                />
              </Form.Item>

              <Form.Item
                className="w-[90%]"
                labelCol={{ span: 24 }}
                name="nuutsUg"
                label={
                  <div className="text-[15px] font-[500] text-[#293050] dark:text-gray-50">
                    Нууц үг
                  </div>
                }
              >
                <Password
                  placeholder="Нууц үг"
                  className="login-input !w-full !rounded-full !py-3"
                />
              </Form.Item>
              <Form.Item className="w-[90%]">
                <Button
                  style={{
                    height: "50px",
                    width: "100%",
                    borderRadius: "25px !important",
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.2) !important",
                  }}
                  className="w-full  bg-[#4FD1C5]"
                  type="primary"
                  htmlType="submit"
                >
                  <p className="m-0 text-base font-[600] dark:text-gray-300">
                    Нэвтрэх
                  </p>
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="flex h-[20%] items-end">
            <div className="font-[600] text-[#FF0000]">© </div>{" "}
            <div className="color-[#2C3832]">
              ZGG LLC © {new Date().getFullYear()}. Бүх эрх хуулиар
              баталгаажсан.
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center overflow-hidden">
          <Image
            width={600}
            height={600}
            className="object-cover"
            src={"/Cash Payment-amico.png"}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  destroyCookie(ctx, "emtoken");
  destroyCookie(ctx, "baiguullagiinId");
  destroyCookie(ctx, "salbariinId");
  return { props: {} };
};

export default Ajiltan;
