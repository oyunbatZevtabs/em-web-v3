import { Button } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import Table from "components/ant/AntdTable";
import { Popover, Popconfirm } from "antd";
import { EyeOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import deleteMethod from "tools/function/crud/posDeleteMethod";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

function KhaaltTuukh({
  tuukh,
  token,
  khaaltTuukhiinMutate,
  onChangeTable,
  suuliinKhaaltOgnooAvyaMutate,
  suuliinKhaaltOgnooData,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCancel() {
    setIsModalOpen(false);
  }

  const columns = useMemo(() => {
    return [
      {
        title: "Өдөр",
        dataIndex: "ognoo",
        ellipsis: true,
        width: "1:5px",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (ognoo) => {
          return <div>{moment(ognoo).startOf("day").format("YYYY-MM-DD")}</div>;
        },
      },
      {
        title: "Хаалт хийсэн өдөр",
        dataIndex: "created_at",
        ellipsis: true,
        width: "155px",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (ognoo) => {
          return <div>{moment(ognoo).format("YYYY-MM-DD HH:mm")}</div>;
        },
      },
      {
        title: "Тайлбар",
        dataIndex: "tailbar",
        ellipsis: true,
        width: "125px",
        align: "center",
        render: (tailbar) => {
          return (
            <Popover content={<div>{tailbar}</div>}>
              <div className="flex max-w-[120px] justify-start truncate">
                {tailbar}
              </div>
            </Popover>
          );
        },
      },
      {
        title: "Мөнгөн тэмдэгт",
        // dataIndex: "mungunTemdegt",
        width: "125px",
        align: "center",
        render: (ner, data) => {
          return (
            <Popover
              content={
                <div>
                  {data.mungunTemdegt.map((e) => {
                    return (
                      !!e.too && (
                        <div className="flex gap-2">
                          <div>{formatNumber(e.temdegt)}₮:</div>
                          <div>{e.too}</div>
                        </div>
                      )
                    );
                  })}
                </div>
              }>
              <div className="flex w-full justify-center">
                <a className="ant-dropdown-link flex gap-2 rounded-lg p-[2px] hover:bg-green-100">
                  <EyeOutlined style={{ fontSize: "18px", color: "#4fc1d5" }} />
                </a>
              </div>
            </Popover>
          );
        },
      },
      {
        title: "Ажилтан",
        dataIndex: "burtgesenAjiltaniiNer",
        width: "125px",
        align: "center",
        render: (ner) => {
          return <div className="text-start">{ner}</div>;
        },
      },
      {
        title: "Нийт дүн",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "niitDun",
        ellipsis: true,
        summary: true,
        width: "125px",
        align: "center",
        render: (niitDun) => {
          return <div className="text-right">{formatNumber(niitDun, 2)}₮</div>;
        },
      },
      {
        width: "50px",
        align: "center",
        render: (e, ugugdul) => {
          const suuliinKhaaltOgnooMoment =
            suuliinKhaaltOgnooData &&
            moment(suuliinKhaaltOgnooData?.ognoo).startOf("day");
          const haalttaiUdur = moment(ugugdul?.ognoo).startOf("day");
          return haalttaiUdur.isBefore(suuliinKhaaltOgnooMoment) ? null : (
            <Popover
              trigger={"hover"}
              placement="bottom"
              content={
                <div className="flex w-20 flex-col gap-2 space-y-2">
                  <Popconfirm
                    title={<div>Хаалт устгах уу?</div>}
                    okText={
                      <div
                        onClick={() =>
                          deleteMethod("khaalt", token, ugugdul._id).then(
                            ({ data }) => {
                              if (data === "Amjilttai") {
                                khaaltTuukhiinMutate();
                                suuliinKhaaltOgnooAvyaMutate();
                                AmjilttaiAlert("Амжилттай устгалаа");
                              }
                            }
                          )
                        }>
                        Тийм
                      </div>
                    }
                    cancelText="Үгүй">
                    <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100">
                      <DeleteOutlined
                        style={{ fontSize: "18px", color: "red" }}
                      />
                      <label>Устгах</label>
                    </a>
                  </Popconfirm>
                </div>
              }>
              <MoreOutlined className="cursor-pointer" />
            </Popover>
          );
        },
      },
    ];
  }, []);
  return (
    <>
      <div className="flex h-[45px] w-full justify-end">
        <Button onClick={() => setIsModalOpen(true)}>Түүх</Button>
      </div>
      {/* <div
        style={{ backgroundColor: "rgba(79, 209, 197, 0.2)" }}
        className={`flex h-[45px] w-[120px] cursor-pointer items-center justify-center gap-1 rounded-[15px] border border-teal-400 px-2 py-1 transition-all duration-300 ease-in-out hover:scale-110 `}
        onClick={() => {
          setIsModalOpen(true);
        }}>
        <div className="truncate text-center font-medium">Түүх</div>
      </div> */}
      <Modal
        width={"938px"}
        okText="Бүртгэх"
        footer={
          <div className="flex w-[156px] justify-end">
            <Button
              onClick={() => handleCancel()}
              size="small"
              style={{ width: "156px" }}>
              Хаах [ESC]
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Хаалтын түүх
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <Table
          onChange={onChangeTable}
          scroll={{ y: "calc(100vh - 25rem)", x: "calc(20vw - 25rem)" }}
          columns={columns}
          dataSource={tuukh?.jagsaalt}
        />
      </Modal>
    </>
  );
}
export default KhaaltTuukh;
