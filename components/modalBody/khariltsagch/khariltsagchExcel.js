import { Button, Form, InputNumber, Popover, Select, message } from "antd";
import { Modal } from "components/ant/AntdModal";
import CustomExcel from "components/excel";
import React, { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import posUilchilgee from "services/posUilchilgee";
import { aldaaBarigch } from "services/uilchilgee";
import usegTooruuKhurvuulekh from "tools/function/usegTooruuKhurvuulekh";
import XLSX from "xlsx";
import { DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import AsuulgaModal from "../asuulgaModal";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

function KhariltsagchExcel({ mutate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [neelttei, setNeelttei] = useState(false);

  const [file, setFile] = useState(null);

  const [khariltsagchiinId, setKhariltsagchiinId] = useState();
  const [selectedMurNer, setSelectedMurNer] = useState();

  const { token, baiguullagiinId, salbariinId } = useAuth();

  const tiim = () => {
    setIsModalOpen(false);
    setNeelttei(false);
    setFile(null);
  };
  const ugui = () => {
    setNeelttei(false);
    setFile(null);
    setIsModalOpen(false);
  };

  function handleCancel() {
    if (!!file) {
      setNeelttei(true);
    } else {
      setIsModalOpen(false);
    }
  }

  function modalOpen(e) {
    setIsModalOpen(true);
    setFile(null);
  }

  function convertData(file, setJagsaalt) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const worksheet = wb.Sheets[wb.SheetNames[0]];

      const jagsaalt = [];
      var tolgoinObject = {};

      for (let cell in worksheet) {
        const cellAsString = cell?.toString();

        if (cellAsString[1] === "1") {
          if (worksheet[cellAsString].v === "Овог")
            tolgoinObject.ovog = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Нэр")
            tolgoinObject.ner = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Төрөл")
            tolgoinObject.turul = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Утас")
            tolgoinObject.utas = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "И-мэйл")
            tolgoinObject.email = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Хаяг")
            tolgoinObject.khayg = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Регистр")
            tolgoinObject.register = usegTooruuKhurvuulekh(cellAsString[0]);
        }
      }

      var data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });

      data.forEach((mur) => {
        let object = {};
        object.ovog = mur[tolgoinObject.ovog];
        object.ner = mur[tolgoinObject.ner];
        object.turul = mur[tolgoinObject.turul];
        object.utas = mur[tolgoinObject.utas];
        object.email = mur[tolgoinObject.email];
        object.khayg = mur[tolgoinObject.khayg];
        object.register = mur[tolgoinObject.register];

        jagsaalt.push(object);
      });

      setJagsaalt(jagsaalt);
    };
    reader.readAsBinaryString(file);
  }

  const columns = useMemo(
    () => [
      {
        title: "Овог",
        dataIndex: "ovog",
        key: "ovog",
        ellipsis: true,
        width: "11rem",
        render: (code) => {
          return <div>{code}</div>;
        },
      },
      {
        title: "Нэр",
        dataIndex: "ner",
        key: "ner",
        ellipsis: true,
        width: "11rem",
        render: (id) => {
          return <div>{id}</div>;
        },
      },
      {
        title: "Төрөл",
        dataIndex: "turul",
        key: "turul",
        ellipsis: true,
        width: "11rem",
        render: (ner) => {
          return <div className=" truncate">{ner}</div>;
        },
      },
      {
        title: "Утас",
        dataIndex: "utas",
        key: "utas",
        ellipsis: true,
        width: "9rem",
      },
      {
        title: "И-мэйл",
        dataIndex: "email",
        key: "email",
        ellipsis: true,
        width: "12rem",
        render: (tsuvraliinDugaar, data) => {
          return (
            <div>
              {typeof tsuvraliinDugaar === "undefined" &&
              data.tsuvraliinDugaarAshiglakh === "Тийм"
                ? "Default"
                : tsuvraliinDugaar}
            </div>
          );
        },
      },
      {
        title: "Хаяг",
        dataIndex: "khayg",
        key: "khayg",
        ellipsis: true,
        width: "10rem",
        render: (une) => {
          return <div>{une}</div>;
        },
      },
      {
        title: "Регистр",
        dataIndex: "register",
        key: "register",
        ellipsis: true,
        width: "10rem",
        render: (urtugUne) => {
          return <div>{urtugUne}</div>;
        },
      },
    ],
    []
  );

  const onFinish = () => {
    if (!!file && !!baiguullagiinId) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("baiguullagiinId", baiguullagiinId);
      formData.append("salbariinId", salbariinId);
      posUilchilgee(token)
        .post("/khariltsagchZagvarTatya", formData)
        .then(({ data, status }) => {
          if (status === 200 && data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгаллаа");
            mutate();
            setIsModalOpen(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else AnkhaaruulgaAlert("Excel файл оруулна уу");
  };

  //   function exceleerTatya() {
  //     const excel = new Excel();
  //     posUilchilgee(token)
  //       .get("/aguulakh", {
  //         query: {
  //           baiguullagiinId: baiguullagiinId,
  //         },
  //         order: order,
  //         khuudasniiKhemjee: baraaGaralt?.niitMur,
  //       })
  //       .then(({ data }) => {
  //         excel
  //           .addSheet("Бараа")
  //           .addColumns([
  //             {
  //               title: "Нэр",
  //               dataIndex: "ner",
  //               key: "ner",
  //             },
  //             {
  //               title: "Бар код",
  //               dataIndex: "barCode",
  //               key: "barCode",
  //             },
  //             {
  //               title: "Ангилал",
  //               dataIndex: "angilal",
  //               key: "angilal",
  //             },
  //             {
  //               title: "Дотоод код",
  //               dataIndex: "code",
  //               key: "code",
  //             },
  //             {
  //               title: "Үлдэгдэл",
  //               dataIndex: "uldegdel",
  //               key: "uldegdel",
  //             },
  //             {
  //               title: "Үнэ",
  //               dataIndex: "niitUne",
  //               key: "niitUne",
  //             },
  //           ])
  //           .addDataSource(data?.jagsaalt)
  //           .saveAs("АгуулахБараа.xlsx");
  //       });
  //   }
  return (
    <div>
      <div>
        <Button
          onClick={() => modalOpen("burtgeh")}
          className="w-28"
          type="gol">
          <FileExcelOutlined className="text-sm" />
          Excel
        </Button>
      </div>

      <Modal
        footer={false}
        onCancel={() => setNeelttei(false)}
        open={neelttei}
        className="flex min-w-[60%] items-center justify-center">
        <div>
          <AsuulgaModal ugui={ugui} tiim={tiim} type="ankhaar" />
        </div>
      </Modal>
      <Modal
        footer={[
          <Button onClick={onFinish} type="primary">
            Хадгалах
          </Button>,
        ]}
        width={"1524px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div className="h-[20px] text-[20px] font-bold"></div>}
        open={isModalOpen}
        onCancel={handleCancel}>
        <div>
          <CustomExcel
            token={token}
            convertData={convertData}
            columns={columns}
            khariltsagchiinId={khariltsagchiinId}
            setKhariltsagchiinId={setKhariltsagchiinId}
            selectedMurNer={selectedMurNer}
            setSelectedMurNer={setSelectedMurNer}
            setFile={setFile}
            file={file}
            tatakhZam={"/khariltsagchZagvarAvya"}
            fileiinNer={"Харилцагч.xlsx"}
          />
        </div>
      </Modal>
    </div>
  );
}
export default KhariltsagchExcel;
