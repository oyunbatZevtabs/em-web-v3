import React, { useEffect, useMemo, useState } from "react";
import { Button, Select } from "antd";
import _ from "lodash";

import { Modal } from "components/ant/AntdModal";
import Table from "components/ant/AntdTable";
import { Table as AntdTable } from "antd";
import formatNumber from "tools/function/formatNumber";
import { Popover } from "components/ant/AntdPopover";
import moment from "moment";
import useJagsaalt from "hooks/posUseJagsaalt";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";

function Delgerengui({ token, baiguullagiinId, dans, ognoo, buttonText }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jurnalDansniiKhuulga, setJurnalDansniiKhuulga] = useState();
  function handleCancel() {
    setIsModalOpen(false);
  }

  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
      dansniiDugaar: [dans.dansniiDugaar],
    }),
    [baiguullagiinId, dans, ognoo]
  );

  // useEffect(() => {
  //   if (!!token && isModalOpen) {
  //     posUilchilgee(token)
  //       .post("/jurnalDansniiKhuulgaAvya", query)
  //       .then(({ data }) => {
  //         setJurnalDansniiKhuulga(data);
  //       })
  //       .catch((e) => aldaaBarigch(e));
  //   }
  // }, [token, isModalOpen]);

  const { data, jagsaalt, setKhuudaslalt, refresh } = useJagsaalt(
    isModalOpen && "/jurnalDansniiKhuulgaAvya",
    query
  );

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        width: "2.5rem",
        className: "text-center",
        align: "center",
        summary: true,
        fixed: "left",
        render: (text, record, index) =>
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Огноо",
        dataIndex: "ognoo",
        className: "text-mashJijig",
        width: "7rem",
        align: "center",
        render: (ognoo) => {
          return <div>{moment(ognoo).format("YYYY-MM-DD")}</div>;
        },
      },
      {
        title: "Харьцсан данс",
        dataIndex: "haritsanDans",
        className: "text-mashJijig",
        width: "15rem",
        align: "center",
        render: (haritsanDans, data) => {
          return (
            <Popover
              content={
                <div className="flex gap-1">
                  <div>{data?.zadargaa?.dansniiDugaar}</div>
                  <div>{data?.zadargaa?.dansniiNer}</div>
                </div>
              }>
              <div className="truncate text-center">
                <div className="flex gap-1">
                  <div>{data?.zadargaa?.dansniiDugaar}</div>
                  <div>{data?.zadargaa?.dansniiNer}</div>
                </div>
              </div>
            </Popover>
          );
        },
      },
      {
        title: "Гүйлгээний утга",
        dataIndex: "guilgeeniiUtga",
        width: "15em",
        className: "text-mashJijig",
        align: "center",
        render: (v, data) => {
          return (
            <Popover content={<div>{data?.zadargaa?.tailbar}</div>}>
              <div className="truncate text-left">
                {data?.zadargaa?.tailbar}
              </div>
            </Popover>
          );
        },
      },
      {
        title: "Дт",
        dataIndex: "dt",
        className: "text-mashJijig",
        align: "center",
        render: (dt, data) => {
          return (
            <div className="text-right">
              {formatNumber(data?.zadargaa?.kreditDun, 2)}
            </div>
          );
        },
      },
      {
        title: "Кт",
        dataIndex: "kt",
        className: "text-mashJijig",
        align: "center",
        render: (kt, data) => {
          return (
            <div className="text-right">
              {formatNumber(data?.zadargaa?.debitDun, 2)}
            </div>
          );
        },
      },
    ];
    return jagsaalt;
  }, [data]);

  return (
    <>
      <a
        className={buttonText > 0 
        ? "text-blue-600 dark:text-yellow-400" 
        : "text-black dark:text-white"}

        onClick={() => buttonText > 0 && setIsModalOpen(true)}>
        {formatNumber(buttonText, 2)}
      </a>
      <Modal
        destroyOnClose={true}
        width={"1000px"}
        footer={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Дансны хуулга
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex h-[600px] flex-col gap-2">
          <div className="flex w-full justify-between">
            <div className="flex gap-3">
              <div className="font-bold">Данс:</div>
              <div className="flex gap-1">
                <div>{dans?.dansniiDugaar}</div>
                <div>{dans?.dansniiNer}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">Эхний үлдэгдэл:</div>

              {dans?.ekhniiUldegdelDebit > 0 && (
                <div>{formatNumber(dans?.ekhniiUldegdelDebit || 0, 2)}</div>
              )}

              {dans?.ekhniiUldegdelKredit > 0 && (
                <div>{formatNumber(dans?.ekhniiUldegdelKredit || 0, 2)}</div>
              )}

              {!dans?.ekhniiUldegdelDebit && !dans?.ekhniiUldegdelKredit && (
                <div>{formatNumber(0, 2)}</div>
              )}
            </div>
          </div>
          <Table
            className={"h-[100%]"}
            size="small"
            unshijBaina={false}
            bordered={true}
            dataSource={data?.jagsaalt}
            pagination={{
              current: data?.khuudasniiDugaar,
              pageSize: data?.khuudasniiKhemjee,
              total: data?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            scroll={{ y: "calc(100vh - 29rem)" }}
            rowClassName="hover:bg-blue-100"
            columns={columns}
            summary={() => {
              return (
                <>
                  <AntdTable.Summary.Row>
                    <AntdTable.Summary.Cell index={1} colSpan={6}>
                      <div className="flex justify-end">
                        <div className="flex gap-2">
                          <div className="font-bold">Эцсийн үлдэгдэл:</div>
                          <div>
                            {dans?.etssiinUldegdel > 0
                              ? formatNumber(dans?.etssiinUldegdel, 2)
                              : formatNumber(0, 2)}
                          </div>
                        </div>
                      </div>
                    </AntdTable.Summary.Cell>
                  </AntdTable.Summary.Row>
                </>
              );
            }}
          />
        </div>
      </Modal>
    </>
  );
}
export default Delgerengui;
