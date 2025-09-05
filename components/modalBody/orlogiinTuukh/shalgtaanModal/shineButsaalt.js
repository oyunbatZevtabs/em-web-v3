import {
  Button,
  Image,
  Input,
  InputNumber,
  Popover,
  table as AntdTable,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "components/ant/AntdModal";
import { useRouter } from "next/router";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import TooShirkhegInput, { TextArea } from "components/ant/AntdInput";
import AldaaAlert from "components/alert/AldaaAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import formatNumber from "tools/function/formatNumber";
import { BsBoxSeam } from "react-icons/bs";
import moment from "moment";
import { BiLeftArrowAlt } from "react-icons/bi";
import { SearchOutlined } from "@ant-design/icons";
import Table from "components/ant/AntdTable";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import TsuvralSongoltModal from "./tsuvralSongoltModal";
import _ from "lodash";

function ShaltgaanModal({
  orlogiinTuukhKhGaraltMutate,
  token,
  // setTuukhData,
  tuukhData,
}) {
  const [tooBichsenBaraanuud, setTooBichsenBaraanuud] = useState([]);
  const [tailbar, setTailbar] = useState("");
  const [butsaaltiinTuluv, setButsaaltiinTuluv] = useState();
  const [tuukhMedeelel, setTuukhMedeelel] = useState(!!tuukhData && tuukhData);
  const [loading, setLoading] = useState(false);

  const [modalOngoikh, setModalOngoikh] = useState(false);

  function onFinish() {
    setLoading(true);
    if (butsaaltiinTuluv === "Бүгд") {
      var { updatedAt, createdAt, baraanuud, ...shineData } = tuukhMedeelel;
      var yavuulakhData = _.cloneDeep(shineData);
      yavuulakhData.shaltgaan = tailbar;
      yavuulakhData.butsaaltiinTuluv = butsaaltiinTuluv;
      // yavuulakhData.butsaaltEsekh = true;

      if (tailbar && tailbar.length > 0) {
        posUilchilgee(token)
          .post("/orlogButsaaltKhiiye", yavuulakhData)
          .then(({ data, status }) => {
            if (data === "Amjilttai") {
              AmjilttaiAlert("Амжилттай буцаалт хийгдлээ.");
              orlogiinTuukhKhGaraltMutate();
              setTooBichsenBaraanuud([]);
              setTailbar("");
              setLoading(false);
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
            setLoading(false);
          });
      } else {
        setLoading(false);
        AnkhaaruulgaAlert("Тайлбар оруулна уу!");
      }
    } else {
      var { updatedAt, createdAt, baraanuud, ...shineData } = tuukhMedeelel;
      var yavuulakhData = _.cloneDeep(shineData);
      var filterBaraa = tooBichsenBaraanuud.filter((a) => a.too > 0);
      if(filterBaraa?.length === 0)
      {
        AnkhaaruulgaAlert("Барааны буцаах тоогоо оруулна уу!");
        setLoading(false);
        return;
      }
      var yavuulakhBaraa = tooBichsenBaraanuud;
      // tuukhMedeelel.baraanuud.forEach((baraaItem) => {
      //   if (!tooBichsenBaraanuud.some((item) => item._id === baraaItem._id)) {
      //     yavuulakhBaraa.push(baraaItem);
      //   }
      // });
      yavuulakhData.butsaaltData = yavuulakhBaraa;
      yavuulakhData.niitDun = tooBichsenBaraanuud?.reduce(
        (a, b) => a + (b.niitUne || 0),
        0
      );
      yavuulakhData.shaltgaan = tailbar;
      yavuulakhData.butsaaltEsekh = true;
      yavuulakhData.butsaaltiinTuluv = butsaaltiinTuluv;
      if (tailbar && tailbar.length > 0) {
        posUilchilgee(token)
          .post("/orlogButsaaltKhiiye", yavuulakhData)
          .then(({ data, status }) => {
            if (data === "Amjilttai") {
              AmjilttaiAlert("Амжилттай буцаалт хийгдлээ.");
              orlogiinTuukhKhGaraltMutate();
              setTooBichsenBaraanuud([]);
              setTailbar("");
              setLoading(false);
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
            setLoading(false);
          });
      } else {
        AnkhaaruulgaAlert("Тайлбар оруулна уу!");
        setLoading(false);
      }
    }
  }

  function butsaahBaraaniiToo(too, mur, tsuvraliinId) {
    var index = tuukhMedeelel.baraanuud.findIndex((item) => item._id === mur._id);
    const newDataSource=[...tuukhMedeelel.baraanuud]
    newDataSource[index]={...tuukhMedeelel.baraanuud[index], "butsaahToo": too}
    tuukhMedeelel.baraanuud = newDataSource;

    var tooNemekhHuwisagch = _.cloneDeep(mur);
    if (too > 0) {
      if (
        (tooNemekhHuwisagch.ognooniiMedeelelBurtgekhEsekh ||
          tooNemekhHuwisagch.tsuvraliinDugaartaiEsekh) &&
        tooNemekhHuwisagch.tsuvral.length === 1
      ) {
        // var tuukhBaraa = tuukhMedeelel?.baraanuud?.find((e) => e._id === mur._id);

        tooNemekhHuwisagch.tsuvral[0].butsaahToo = too;
        tooNemekhHuwisagch.tsuvral[0].too = too;

        tooNemekhHuwisagch.niitUne = tooNemekhHuwisagch.urtugUne * too;

        tooNemekhHuwisagch.butsaahToo = too;
        tooNemekhHuwisagch.too = tooNemekhHuwisagch.tsuvral.reduce(
          (a, b) => a + (b.too || 0),
          0
        );

        if (tooNemekhHuwisagch.butsaahToo <= 0) {
          setTooBichsenBaraanuud((prev) =>
            prev.filter((item) => item._id !== tooNemekhHuwisagch._id)
          );
        } else {
          setTooBichsenBaraanuud((prevState) => {
            var prevStateesHassanData = prevState.filter(
              (a) => a._id !== tooNemekhHuwisagch._id
            );
            return [...prevStateesHassanData, tooNemekhHuwisagch];
          });
        }
      } else if (
        !tooNemekhHuwisagch.ognooniiMedeelelBurtgekhEsekh &&
        !tooNemekhHuwisagch.tsuvraliinDugaartaiEsekh
      ) {
        // var tuukhBaraa = tuukhMedeelel.baraanuud?.find((e) => e._id === mur._id);

        tooNemekhHuwisagch.butsaahToo = too;
        tooNemekhHuwisagch.too = too;
        tooNemekhHuwisagch.niitUne = tooNemekhHuwisagch.urtugUne * +too;

        setTooBichsenBaraanuud((prevState) => {
          var prevStateesHassanData = prevState.filter(
            (a) => a._id !== tooNemekhHuwisagch._id
          );
          return [...prevStateesHassanData, tooNemekhHuwisagch];
        });
      } else if (
        (tooNemekhHuwisagch.ognooniiMedeelelBurtgekhEsekh ||
          tooNemekhHuwisagch.tsuvraliinDugaartaiEsekh) &&
        tooNemekhHuwisagch.tsuvral.length > 1
      ) {
        var songogdsonTsuvral = tooNemekhHuwisagch.tsuvral.find(
          (tsuvral) => tsuvral._id === tsuvraliinId
        );

        if (songogdsonTsuvral) {
          songogdsonTsuvral.butsaahToo = too;
          setTooBichsenBaraanuud((prevState) => {
            var prevStateWithoutUpdatedObject = prevState.filter(
              (a) => a._id !== tooNemekhHuwisagch._id
            );
            return [...prevStateWithoutUpdatedObject, tooNemekhHuwisagch];
          });
        }
      }
    } else {
      var ustsanDatataiHuwisagch = tooBichsenBaraanuud;
      setTooBichsenBaraanuud(
        ustsanDatataiHuwisagch.filter((a) => a._id !== mur._id)
      );
    }
  }

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        key: "index",
        className: "text-center",
        align: "center",
        width: "3rem",
        fixed: "left",
        render: (text, record, index) => index + 1,
      },
      {
        title: <div className="text-center font-semibold">Бар код</div>,
        dataIndex: "barCode",
        align: "right",
        key: "barCode",
        width: "9rem",
      },
      {
        title: <div className="text-center font-semibold">Дотоод код</div>,
        dataIndex: "code",
        align: "center",
        key: "code",
        width: "9rem",
      },
      {
        title: <div className="text-center font-semibold">Нэр</div>,
        dataIndex: "ner",
        align: "left",
        key: "ner",
        ellipsis: true,
      },
      {
        title: <div className="text-center font-semibold">Зарах үнэ</div>,
        dataIndex: "zarakhUne",
        align: "right",
        key: "zarakhUne",
        width: "9rem",
        render: (zarakhUne, record, index) => {
          return <div>{formatNumber(zarakhUne, 2)}₮</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Нэгж өртөг</div>,
        dataIndex: "urtugUne",
        align: "right",
        key: "urtugUne",
        width: "9rem",
        render: (text, record, index) => {
          return <div>{formatNumber(text, 2)}₮</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Тоо хэмжээ</div>,
        dataIndex: "too",
        align: "center",
        summary: true,
        key: "too",
        width: "9rem",
        render: (text, record, index) => {
          return (
            <Popover
              content={record?.tsuvral?.map((e) => (
                <div className="flex w-[300px] justify-between">
                  <div>
                    {record.ognooniiMedeelelBurtgekhEsekh
                      ? moment(e.duusakhOgnoo).format("YYYY-MM-DD")
                      : e.dugaar}
                  </div>
                  <div>{e.too}ш</div>
                </div>
              ))}>
              <div>{text}ш</div>
            </Popover>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Нийт үнэ</div>,
        dataIndex: "urtugUne",
        align: "right",
        key: "urtugUne",
        summary: true,
        width: "9rem",
        render: (text, record, index) => {
          return <div>{formatNumber(record.urtugUne * record.too, 2)}₮</div>;
        },
      },
      {
        title: "",
        dataIndex: "butsaahToo",
        align: "right",
        key: "butsaahToo",
        summary: true,
        width: "9rem",
        render: (text, record, index) => {
          return (
            <div>
              {record.tsuvral.length > 1 ? (
                <TsuvralSongoltModal
                  tuukhBaraa={record}
                  setTooBichsenBaraanuud={setTooBichsenBaraanuud}
                  tooBichsenBaraanuud={tooBichsenBaraanuud}
                />
              ) : (
                <TooShirkhegInput
                  value={record.butsaahToo}
                  max={
                    record.tsuvral.length === 1
                      ? record.tsuvral[0]?.too
                      : record.too
                  }
                  onChange={(value) => butsaahBaraaniiToo(value, record)}
                  placeHolder={"Буцаах тоо"}
                />
              )}
            </div>
          );
        },
      },
    ];
  }, [tooBichsenBaraanuud]);

  function UilgelAvya({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);
    let totalSum = 0;

    for (const obj of garalt) {
      const product = obj.too * obj.urtugUne;
      totalSum += product;
    }

    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => (
          <AntdTable.Summary.Cell
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align="right">
            {mur.summary ? (
              mur.dataIndex === "urtugUne" ? (
                formatNumber(totalSum, 2) + " ₮"
              ) : mur.dataIndex === "baraaniiKhariltsagch" ? (
                <div className="flex items-center justify-start">Нийт</div>
              ) : (
                tooOronKhyazgaarliy(
                  garalt?.reduce((a, b) => a + (b[mur.dataIndex] || 0), 0),
                  2
                ) + "ш"
              )
            ) : (
              ""
            )}
          </AntdTable.Summary.Cell>
        ))}
      </AntdTable.Summary.Row>
    );
  }

  return (
    <div>
      <div className="flex w-fit flex-col space-y-2">
        <a
          onClick={() => {
            setModalOngoikh(true);
            // setTuukhData({
            //   ...record,
            //   butsaaltiinTuluv: "Бараа сонгох",
            // });
            setButsaaltiinTuluv("Бараа сонгох");
          }}
          className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100">
          <label className="text-[#4fc1d5]">Бараа сонгож буцаах</label>
        </a>
        <a
          onClick={() => {
            setModalOngoikh(true);

            setButsaaltiinTuluv("Бүгд");
          }}
          className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100">
          <label className="text-[#4fc1d5]">Бүх барааг буцаах</label>
        </a>
      </div>
      <Modal
        destroyOnClose={true}
        width={butsaaltiinTuluv === "Бараа сонгох" ? 1300 : 480}
        okText="Бүртгэх"
        footer={
          <Button onClick={loading === false && onFinish} type="primary">
            Буцаалт хийх
          </Button>
        }
        header={false}
        onCancel={() => {
          setModalOngoikh(false);
          setTailbar();
          setTooBichsenBaraanuud([]);
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div className="text-center font-normal">Буцаалт</div>}
        open={modalOngoikh}>
        {butsaaltiinTuluv === "Бараа сонгох" ? (
          <>
            <Table
              scroll={{ y: "calc(100vh - 25rem)", x: "calc(20vw - 25rem)" }}
              dataSource={
                !!tuukhMedeelel?.baraanuud ? tuukhMedeelel?.baraanuud : null
              }
              columns={columns}
              summary={() =>
                !!tuukhMedeelel?.baraanuud && (
                  <AntdTable.Summary fixed>
                    <UilgelAvya
                      garalt={
                        !!tuukhMedeelel?.baraanuud && tuukhMedeelel?.baraanuud
                      }
                      columns={columns}
                    />{" "}
                  </AntdTable.Summary>
                )
              }
            />
            <TextArea
              value={tailbar}
              onChange={(e) => setTailbar(e.target.value)}
              placeHolder="Тайлбар"
            />
          </>
        ) : (
          <TextArea
            value={tailbar}
            onChange={(e) => setTailbar(e.target.value)}
            placeHolder="Тайлбар"
          />
        )}
      </Modal>
    </div>
  );
}

export default ShaltgaanModal;
