import { Popover, Table } from "antd";
import moment from "moment";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import formatNumber from "tools/function/formatNumber";

const DelgerenguiKharakh = ({ data, destroy }, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    []
  );

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
        title: <div className="text-center font-semibold">Барааны нэр</div>,
        dataIndex: "ner",
        align: "left",
        key: "ner",
        ellipsis: true,
      },
      {
        title: <div className="text-center font-semibold">Дотоод код</div>,
        dataIndex: "code",
        align: "center",
        key: "code",
        width: "9rem",
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
                <div className="flex w-[300px] gap-2" key={e._id}>
                  <div className="w-[80px] flex-shrink-0">
                    {record.tsuvraliinDugaartaiEsekh ? e.dugaar : undefined}
                  </div>
                  <div className="w-[120px] flex-shrink-0">
                    {record.ognooniiMedeelelBurtgekhEsekh
                      ? moment(e.duusakhOgnoo).format("YYYY-MM-DD")
                      : e.dugaar}
                  </div>
                  <div className="w-[80px] flex-shrink-0 text-right">
                    {e.too}ш
                  </div>
                </div>
              ))}
            >
              <div>{text}ш</div>
            </Popover>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Нийт үнэ</div>,
        dataIndex: "urtugUne",
        align: "right",
        key: "niitUne",
        summary: true,
        width: "9rem",
        render: (text, record, index) => {
          return <div>{formatNumber(record.urtugUne * record.too, 2)}₮</div>;
        },
      },
    ];
  }, [data]);

  return (
    <div className="w-full">
      <Table
        tableLayout="auto"
        columns={columns}
        dataSource={data?.baraanuud}
        pagination={false}
        summary={(pageData) => {
          let totalQuantity = 0;
          let totalPrice = 0;
          pageData.forEach(({ too, urtugUne }) => {
            totalQuantity += too || 0;
            totalPrice += urtugUne * too || 0;
          });

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <div className="text-center font-semibold">Нийт:</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <div className="text-center font-semibold">
                  {totalQuantity}ш
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                <div className="text-right font-semibold">
                  {formatNumber(totalPrice, 2)}₮
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default forwardRef(DelgerenguiKharakh);
