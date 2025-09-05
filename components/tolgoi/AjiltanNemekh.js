import React, { useRef } from "react";
import { Button } from "antd";
import { modal } from "components/ant/Modal";
import { FileExcelOutlined } from "@ant-design/icons";
import AjiltanNemjOruulakh from "./AjiltanNemjOruulakh";

function AjiltanNemekh({ ajiltanNemya }) {
  const ref = useRef();
  function ajiltanNemyaKharuulya() {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Бүртгэл нэмэх
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: <AjiltanNemjOruulakh ref={ref} ajiltanNemya={ajiltanNemya} />,
      footer,
    });
  }

  return (
    <div>
      <Button type="primary" className="mb-10" onClick={ajiltanNemyaKharuulya}>
        Ажилтан нэмэх
      </Button>
    </div>
  );
}

export default AjiltanNemekh;
