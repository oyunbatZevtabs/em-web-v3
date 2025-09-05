import { Button } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import posUilchilgee from "services/posUilchilgee";
import Table from "components/ant/AntdTable";
import formatNumber from "tools/function/formatNumber";

function BonusDelegrengui({
  bonus,
  setBonus,
  token,
  baiguullagiinId,
  salbariinId,
}) {
  const [data, setData] = useState();
  useEffect(() => {
    if (!!bonus) {
      posUilchilgee(token)
        .post("/khariltsagchiinOnooniiTuukh", {
          baiguullagiinId,
          salbariinId,
          id: bonus._id,
        })
        .then(({ data }) => {
          if (data) {
            setData(data);
          }
        });
    }
  }, [bonus, salbariinId, baiguullagiinId]);
  const columns = useMemo(
    () => [
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
        title: "Огноо",
        dataIndex: "ognoo",
        key: "ognoo",
        align: "center",
        ellipsis: true,
        width: "9rem",
        render: (ognoo) => {
          return <div>{moment(ognoo).format("YYYY-MM-DD HH:mm")}</div>;
        },
      },
      {
        title: "Гүйлгээний дугаар",
        dataIndex: "guilgeeniiDugaar",
        key: "guilgeeniiDugaar",
        align: "center",
        ellipsis: true,
        width: "9rem",
        render: (guilgeeniiDugaar) => {
          return <div className="text-center">{guilgeeniiDugaar}</div>;
        },
      },
      {
        title: "Нийт үнэ",
        dataIndex: "niitUne",
        key: "niitUne",
        ellipsis: true,
        align: "center",

        width: "6rem",
        render: (niitUne) => {
          return <div className="text-right">{formatNumber(niitUne, 2)}</div>;
        },
      },
      // {
      //   title: "Хуримтлуулсан",
      //   dataIndex: "khariltsagch",
      //   key: "khariltsagch",
      //   ellipsis: true,
      //   width: "6.5rem",
      //   render: (umnukh) => {
      //     return <div>{formatNumber(umnukh?.bonus?.umnukh || 0, 2)}</div>;
      //   },
      // },
      {
        title: "Хуримтлуулсан",
        dataIndex: "khariltsagch",
        key: "khariltsagch",
        align: "center",

        ellipsis: true,
        width: "8rem",
        render: (nemegdsen) => {
          return (
            <div className="text-right">
              {formatNumber(nemegdsen?.bonus?.nemegdsen || 0, 2)}
            </div>
          );
        },
      },
      {
        title: "Зарцуулсан",
        dataIndex: "khariltsagch",
        key: "khariltsagch",
        ellipsis: true,
        align: "center",

        width: "8rem",
        render: (code) => {
          return (
            <div className="text-right">
              {formatNumber(code?.bonus?.ashiglasan || 0, 2)}
            </div>
          );
        },
      },

      {
        title: "Эцсийн үлдэгдэл",
        dataIndex: "khariltsagch",
        align: "center",

        key: "khariltsagch",
        ellipsis: true,
        width: "8rem",
        render: (nemegdsen) => {
          return (
            <div className="text-right">
              {formatNumber(
                (nemegdsen?.bonus?.umnukh || 0) -
                  (nemegdsen?.bonus?.ashiglasan || 0) +
                  (nemegdsen?.bonus?.nemegdsen || 0),
                2
              )}
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <Modal
        zIndex={9999}
        width={"1200px"}
        okText={false}
        footer={
          <div className="flex w-full justify-end">
            <Button
              onClick={() => setBonus()}
              style={{ width: "130px", height: "36px" }}>
              Хаах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={false}
        open={bonus}
        onCancel={() => setBonus()}>
        <div className=" mt-5 flex flex-col items-center gap-8 px-1 py-3">
          <Table
            scroll={{ y: "calc(100vh - 30rem)" }}
            dataSource={data}
            columns={columns}
          />
        </div>
      </Modal>
    </>
  );
}
export default BonusDelegrengui;
