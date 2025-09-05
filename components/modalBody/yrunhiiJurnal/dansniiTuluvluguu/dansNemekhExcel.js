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
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AsuulgaModal from "components/modalBody/asuulgaModal";
import formatNumber from "tools/function/formatNumber";

function DansNemekhExcel({ mutate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [neelttei, setNeelttei] = useState(false);

  const [file, setFile] = useState(null);

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
          if (worksheet[cellAsString].v === "Код")
            tolgoinObject.kod = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Нэр")
            tolgoinObject.ner = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Дансны бүлэг")
            tolgoinObject.dansniiBuleg = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Валют")
            tolgoinObject.valyut = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Дансны шинж")
            tolgoinObject.dansniiShinj = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Төрөл")
            tolgoinObject.turul = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Туслах журнал")
            tolgoinObject.tuslakhJurnal = usegTooruuKhurvuulekh(
              cellAsString[0]
            );
          else if (worksheet[cellAsString].v === "Эхний үлдэгдэл")
            tolgoinObject.ekhniiUldegdel = usegTooruuKhurvuulekh(
              cellAsString[0]
            );
          else if (worksheet[cellAsString].v === "Үлдэгдэл шалгах")
            tolgoinObject.uldegdelShalgakh = usegTooruuKhurvuulekh(
              cellAsString[0]
            );
        }
      }

      var data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });

      data.forEach((mur) => {
        let object = {};
        object.kod = mur[tolgoinObject.kod];
        object.ner = mur[tolgoinObject.ner];
        object.dansniiBuleg = mur[tolgoinObject.dansniiBuleg];
        object.valyut = mur[tolgoinObject.valyut];
        object.dansniiShinj = mur[tolgoinObject.dansniiShinj];
        object.turul = mur[tolgoinObject.turul];
        object.tuslakhJurnal = mur[tolgoinObject.tuslakhJurnal];
        object.ekhniiUldegdel = mur[tolgoinObject.ekhniiUldegdel];
        object.uldegdelShalgakh = mur[tolgoinObject.uldegdelShalgakh];

        jagsaalt.push(object);
      });

      setJagsaalt(jagsaalt);
    };
    reader.readAsBinaryString(file);
  }

  const columns = useMemo(
    () => [
      {
        title: "Код",
        dataIndex: "kod",
        key: "kod",
        ellipsis: true,
        width: "11rem",
        render: (kod) => {
          return <div>{kod}</div>;
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
        title: "Дансны бүлэг",
        dataIndex: "dansniiBuleg",
        key: "dansniiBuleg",
        ellipsis: true,
        width: "11rem",
        render: (dansniiBuleg) => {
          return <div className=" truncate">{dansniiBuleg}</div>;
        },
      },
      {
        title: "Валют",
        dataIndex: "valyut",
        key: "valyut",
        ellipsis: true,
        width: "9rem",
      },
      {
        title: "Дансны шинж",
        dataIndex: "dansniiShinj",
        key: "dansniiShinj",
        ellipsis: true,
        width: "12rem",
        render: (dansniiShinj, data) => {
          return <div>{dansniiShinj}</div>;
        },
      },
      {
        title: "Төрөл",
        dataIndex: "turul",
        key: "turul",
        ellipsis: true,
        width: "10rem",
        render: (turul) => {
          return <div>{turul}</div>;
        },
      },
      {
        title: "Туслах журнал",
        dataIndex: "tuslakhJurnal",
        key: "tuslakhJurnal",
        ellipsis: true,
        width: "10rem",
        render: (tuslakhJurnal) => {
          return <div>{tuslakhJurnal}</div>;
        },
      },
      {
        title: "Эхний үлдэгдэл",
        dataIndex: "ekhniiUldegdel",
        key: "ekhniiUldegdel",
        ellipsis: true,
        width: "10rem",
        render: (ekhniiUldegdel) => {
          return <div>{formatNumber(ekhniiUldegdel, 2)}</div>;
        },
      },
      {
        title: "Үлдэгдэл шалгах",
        dataIndex: "uldegdelShalgakh",
        key: "uldegdelShalgakh",
        ellipsis: true,
        width: "10rem",
        render: (uldegdelShalgakh) => {
          return <div>{uldegdelShalgakh}</div>;
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
        .post("/dansTatya", formData)
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
            setFile={setFile}
            file={file}
            tatakhZam={"/dansniiZagvarAvya"}
            fileiinNer={"Данс.xlsx"}
          />
        </div>
      </Modal>
    </div>
  );
}
export default DansNemekhExcel;
