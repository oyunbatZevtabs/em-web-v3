import { Button, Form, InputNumber, Popover, Select, message } from "antd";
import { Modal } from "components/ant/AntdModal";
import CustomExcel from "components/excel";
import React, { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import posUilchilgee from "services/posUilchilgee";
import { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import usegTooruuKhurvuulekh from "tools/function/usegTooruuKhurvuulekh";
import XLSX from "xlsx";
import { DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import AsuulgaModal from "../asuulgaModal";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

const order = { createdAt: -1 };

function AguulakhExcel({
  aguulakhToololtMutate,
  baraaGaralt,
  aguulahMutate,
  baraaQuery,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [neelttei, setNeelttei] = useState(false);
  const [umKhiisenEsekh, setUmKhiisenEsekh] = useState(false);

  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);

  const [khariltsagchiinId, setKhariltsagchiinId] = useState();
  const [selectedMurNer, setSelectedMurNer] = useState();

  const [text, setText] = useState();
  const { token, baiguullagiinId, ajiltan, salbariinId } = useAuth();

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const tiim = () => {
    setIsModalOpen(false);
    setNeelttei(false);
    setFile(null);
  };
  const ugui = () => {
    setNeelttei(false);
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
    setOpen(false);
    setFile(null);
    setText(e);
  }

  function convertData(file, setJagsaalt, setJagsaalt2) {
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
          if (worksheet[cellAsString].v === "Дотоод код")
            tolgoinObject.code = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Бар код")
            tolgoinObject.barCode = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Нэр")
            tolgoinObject.ner = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Хэмжих нэгж")
            tolgoinObject.khemjikhNegj = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Цувралын дугаар")
            tolgoinObject.tsuvraliinDugaar = usegTooruuKhurvuulekh(
              cellAsString[0]
            );
          else if (worksheet[cellAsString].v === "Худалдах үнэ")
            tolgoinObject.une = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Нэгж өртөг")
            tolgoinObject.urtugUne = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Үлдэгдэл")
            tolgoinObject.uldegdel = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Aнгилал")
            tolgoinObject.angilal = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "НӨАТ бодох")
            tolgoinObject.noatBodohEsekh = usegTooruuKhurvuulekh(
              cellAsString[0]
            );
          else if (worksheet[cellAsString].v === "Богино нэр")
            tolgoinObject.boginoNer = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Дуусах огноо")
            tolgoinObject.duusakhOgnoo = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Цуврал дугаар ашиглах")
            tolgoinObject.tsuvraliinDugaarAshiglakh = usegTooruuKhurvuulekh(
              cellAsString[0]
            );
          else if (worksheet[cellAsString].v === "Дуусах хугацаа ашиглах")
            tolgoinObject.duusakhKhugtsaaAshiglakh = usegTooruuKhurvuulekh(
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
        object.code = mur[tolgoinObject.code];
        object.barCode = mur[tolgoinObject.barCode];
        object.ner = mur[tolgoinObject.ner];
        object.khemjikhNegj = mur[tolgoinObject.khemjikhNegj];
        object.tsuvraliinDugaar = mur[tolgoinObject.tsuvraliinDugaar];
        object.une = mur[tolgoinObject.une];
        object.urtugUne = mur[tolgoinObject.urtugUne];
        object.uldegdel = mur[tolgoinObject.uldegdel];
        object.angilal = mur[tolgoinObject.angilal];
        object.noatBodohEsekh = mur[tolgoinObject.noatBodohEsekh];
        object.boginoNer = mur[tolgoinObject.boginoNer];
        object.duusakhOgnoo = mur[tolgoinObject.duusakhOgnoo];
        object.tsuvraliinDugaarAshiglakh =
          mur[tolgoinObject.tsuvraliinDugaarAshiglakh];
        object.duusakhKhugtsaaAshiglakh =
          mur[tolgoinObject.duusakhKhugtsaaAshiglakh];

        if (!!object.code) jagsaalt.push(object);
      });

      setJagsaalt(jagsaalt);
    };
    reader.readAsBinaryString(file);
  }

  function convertData2(file, setJagsaalt) {
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
          if (worksheet[cellAsString].v === "Дотоод код")
            tolgoinObject.code = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Бар код")
            tolgoinObject.barCode = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Цувралын дугаар")
            tolgoinObject.tsuvral = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Нэгж өртөг")
            tolgoinObject.urtugUne = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Ширхэг")
            tolgoinObject.uldegdel = usegTooruuKhurvuulekh(cellAsString[0]);
          else if (worksheet[cellAsString].v === "Дуусах огноо")
            tolgoinObject.duusakhOgnoo = usegTooruuKhurvuulekh(cellAsString[0]);
        }
      }

      var data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });

      data.forEach((mur) => {
        let object = {};
        object.code = mur[tolgoinObject.code];
        object.barCode = mur[tolgoinObject.barCode];
        object.tsuvral = mur[tolgoinObject.tsuvral];
        object.urtugUne = mur[tolgoinObject.urtugUne];
        object.uldegdel = mur[tolgoinObject.uldegdel];
        object.khuleejAvsanOgnoo = mur[tolgoinObject.khuleejAvsanOgnoo];
        object.duusakhOgnoo = mur[tolgoinObject.duusakhOgnoo];

        if (!!object.code) jagsaalt.push(object);
      });

      setJagsaalt(jagsaalt);
      setUmKhiisenEsekh(true);
    };
    reader.readAsBinaryString(file);
  }

  const columns = useMemo(
    () => [
      {
        title: "Дотоод код",
        dataIndex: "code",
        key: "code",
        ellipsis: true,
        width: "11rem",
        render: (code) => {
          return <div>{code}</div>;
        },
      },
      {
        title: "Бар код",
        dataIndex: "barCode",
        key: "barCode",
        ellipsis: true,
        width: "11rem",
        render: (id) => {
          return <div>{id}</div>;
        },
      },
      {
        title: "Нэр",
        dataIndex: "ner",
        key: "ner",
        ellipsis: true,
        width: "11rem",
        render: (ner) => {
          return <div className=" truncate">{ner}</div>;
        },
      },
      {
        title: "Хэмжих нэгж",
        dataIndex: "khemjikhNegj",
        key: "khemjikhNegj",
        ellipsis: true,
        width: "9rem",
      },
      {
        title: "Цувралын дугаар",
        dataIndex: "tsuvraliinDugaar",
        key: "tsuvraliinDugaar",
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
        title: "Худалдах үнэ",
        dataIndex: "une",
        key: "une",
        ellipsis: true,
        width: "10rem",
        render: (une) => {
          return <div>{formatNumber(une || 0, 2)}</div>;
        },
      },
      {
        title: "Нэгж өртөг",
        dataIndex: "urtugUne",
        key: "urtugUne",
        ellipsis: true,
        width: "10rem",
        render: (urtugUne) => {
          return <div>{formatNumber(urtugUne || 0, 2)}</div>;
        },
      },
      {
        title: "Үлдэгдэл",
        key: "uldegdel",
        dataIndex: "uldegdel",
        ellipsis: true,
        width: "12rem",
        render: (uldegdel) => {
          return <div className=" text-green-500">{uldegdel}</div>;
        },
      },
      {
        title: "Aнгилал",
        key: "angilal",
        dataIndex: "angilal",
        ellipsis: true,
        width: "11rem",
        render: (angilal) => {
          return <div className=" text-green-500">{angilal}</div>;
        },
      },
      {
        title: "НӨАТ бодох",
        key: "noatBodohEsekh",
        dataIndex: "noatBodohEsekh",
        ellipsis: true,
        width: "12rem",
        render: (noatBodohEsekh) => {
          return <div className=" text-green-500">{noatBodohEsekh}</div>;
        },
      },
      {
        title: "Богино нэр",
        key: "boginoNer",
        dataIndex: "boginoNer",
        ellipsis: true,
        width: "6rem",
        render: (boginoNer) => {
          return <div>{boginoNer}</div>;
        },
      },
      {
        title: "Дуусах огноо",
        dataIndex: "duusakhOgnoo",
        ellipsis: true,
        width: "6rem",
        render: (duusakhOgnoo) => {
          return <div className=" text-green-500">{duusakhOgnoo}</div>;
        },
      },
      {
        title: "Цуврал дугаар ашиглах",
        dataIndex: "tsuvraliinDugaarAshiglakh",
        ellipsis: true,
        width: "6rem",
        render: (tsuvraliinDugaarAshiglakh) => {
          return (
            <div className=" text-green-500">{tsuvraliinDugaarAshiglakh}</div>
          );
        },
      },
      {
        title: "Дуусах хугацаа ашиглах",
        dataIndex: "duusakhKhugtsaaAshiglakh",
        ellipsis: true,
        width: "6rem",
        render: (duusakhKhugtsaaAshiglakh) => {
          return (
            <div className=" text-green-500">{duusakhKhugtsaaAshiglakh}</div>
          );
        },
      },
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      {
        title: "Дотоод код",
        dataIndex: "code",
        key: "code",
        ellipsis: true,
        width: "5rem",
        render: (code) => {
          return <div>{code}</div>;
        },
      },
      {
        title: "Бар код",
        dataIndex: "barCode",
        key: "barCode",
        ellipsis: true,
        width: "5rem",
        render: (id) => {
          return <div>{id}</div>;
        },
      },
      {
        title: "Цувралын дугаар",
        dataIndex: "tsuvral",
        key: "tsuvral",
        ellipsis: true,
        width: "10rem",
        render: (tsuvral) => {
          return <div>{tsuvral}</div>;
        },
      },
      {
        title: "Нэгж өртөг",
        key: "urtugUne",
        dataIndex: "urtugUne",
        ellipsis: true,
        width: "6rem",
        render: (une) => {
          return <div>{formatNumber(une || 0, 2)}</div>;
        },
      },
      {
        title: "Ширхэг",
        key: "uldegdel",
        dataIndex: "uldegdel",
        ellipsis: true,
        width: "6rem",
        render: (shirkheg) => {
          return <div className=" text-green-500">{shirkheg}</div>;
        },
      },

      {
        title: "Дуусах огноо",
        key: "duusakhOgnoo",
        dataIndex: "duusakhOgnoo",
        ellipsis: true,
        width: "6rem",
        render: (duusakhOgnoo) => {
          return <div className=" text-green-500">{duusakhOgnoo}</div>;
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
        .post("/aguulkhiinZagvarTatya", formData)
        .then(({ data, status }) => {
          if (status === 200 && data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгаллаа");
            aguulakhToololtMutate();
            aguulahMutate();
            setIsModalOpen(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else AnkhaaruulgaAlert("Excel файл оруулна уу");
  };

  const onFinish2 = () => {
    if (!khariltsagchiinId && !selectedMurNer) {
      AnkhaaruulgaAlert("Нийлүүлэгч сонгоно уу");
      return;
    }
    if (!!file && !!baiguullagiinId) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("baiguullagiinId", baiguullagiinId);
      formData.append("khariltsagchiinId", khariltsagchiinId);
      formData.append("khariltsagchiinNer", selectedMurNer);
      formData.append("salbariinId", salbariinId);

      posUilchilgee(token)
        .post("/orlogiinZagvarTatya", formData)
        .then(({ data, status }) => {
          if (status === 200 && data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгаллаа");
            aguulakhToololtMutate();
            aguulahMutate();
            setKhariltsagchiinId();
            setIsModalOpen(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else AnkhaaruulgaAlert("Excel файл аа сонгоно уу?");
  };

  function exceleerTatya() {
    const excel = new Excel();
    posUilchilgee(token)
      .get("/aguulakh", {
        params: {
          query: {
            baiguullagiinId: baiguullagiinId,
            ...baraaQuery,
          },
          order: order,
          khuudasniiKhemjee: baraaGaralt?.niitMur,
        },
      })
      .then(({ data }) => {
        excel
          .addSheet("Бараа")
          .addColumns([
            {
              title: "Нэр",
              dataIndex: "ner",
              key: "ner",
            },
            {
              title: "Бар код",
              dataIndex: "barCode",
              key: "barCode",
            },
            {
              title: "Ангилал",
              dataIndex: "angilal",
              key: "angilal",
            },
            {
              title: "Дотоод код",
              dataIndex: "code",
              key: "code",
            },
            {
              title: "Үлдэгдэл",
              dataIndex: "uldegdel",
              key: "uldegdel",
            },
            {
              title: "Үнэ",
              dataIndex: "niitUne",
              key: "niitUne",
            },
            {
              title: "Нэгж өртөг",
              dataIndex: "urtugUne",
              key: "urtugUne",
            },
          ])
          .addDataSource(data?.jagsaalt)
          .saveAs("АгуулахБараа.xlsx");
      });
  }
  return (
    <div className="w-full">
      <div className="w-full">
        <Popover
          placement="bottom"
          content={
            <div className="flex flex-col gap-2">
              <Button onClick={() => modalOpen("burtgeh")} type="gol">
                <FileExcelOutlined className="text-sm" />
                Бүртгэх
              </Button>
              <Button onClick={() => modalOpen("orlogodoh")} type="gol">
                <FileExcelOutlined className="text-sm" />
                Орлого
              </Button>
              <Button onClick={() => exceleerTatya()} type="gol">
                <DownloadOutlined className="pr-3 text-lg" />
                <div className="pr-3">Татах</div>
              </Button>
            </div>
          }
          title={false}
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Button className="w-full" type="gol">
            <FileExcelOutlined className="text-sm" />
            Excel
          </Button>
        </Popover>
      </div>

      <Modal
        footer={false}
        onCancel={() => setNeelttei(false)}
        open={neelttei}
        className="flex min-w-[60%] items-center justify-center"
      >
        <div>
          <AsuulgaModal ugui={ugui} tiim={tiim} type="ankhaar" />
        </div>
      </Modal>
      <Modal
        footer={[
          <Button
            onClick={text === "burtgeh" ? onFinish : onFinish2}
            type="primary"
          >
            Хадгалах
          </Button>,
        ]}
        width={"1524px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div className="h-[20px] text-[20px] font-bold"></div>}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <div>
          <CustomExcel
            token={token}
            convertData={text === "burtgeh" ? convertData : convertData2}
            columns={text === "burtgeh" ? columns : columns2}
            khariltsagchiinId={khariltsagchiinId}
            setKhariltsagchiinId={setKhariltsagchiinId}
            selectedMurNer={selectedMurNer}
            setSelectedMurNer={setSelectedMurNer}
            setFile={setFile}
            file={file}
            tatakhZam={
              text === "burtgeh"
                ? "/aguulkhiinZagvarAvya"
                : "/orlogiinZagvarAvya"
            }
            fileiinNer={
              text === "burtgeh" ? "baraaBurtgekh.xlsx" : "baraaOrlogdokh.xlsx"
            }
          />
        </div>
      </Modal>
    </div>
  );
}
export default AguulakhExcel;
