import { Button, Popover } from "antd";
import { Modal } from "components/ant/AntdModal";
import React from "react";
import moment from "moment";
import { CloseOutlined, DoubleRightOutlined } from "@ant-design/icons";

function UramshuulalModal({
  uramshuulal,
  setUramshuulal,
  posEsekh,
  uramshuulalOruulakh,
}) {
  const zuvhunKharakh = !!uramshuulal?.find((a) => a.zuvhunKharakh === true);

  return (
    <>
      <Modal
        zIndex={9999}
        width={"580px"}
        okText={false}
        footer={
          <div className="flex w-full justify-end">
            <Button
              onClick={() => setUramshuulal([])}
              style={{ width: "130px", height: "36px" }}
            >
              Хаах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={false}
        open={uramshuulal.length > 0}
        onCancel={() => setUramshuulal([])}
      >
        <div className=" mt-5 flex flex-col items-center gap-8 px-1 py-3">
          {uramshuulal
            ?.filter((a) => a.zuvhunKharakh !== true)
            .map((data, index) => {
              return (
                <div
                  key={index}
                  className="relative grid w-full grid-cols-2 rounded-lg border border-[#4FD1C5] p-3 pb-5 pt-3"
                >
                  <div className="absolute -top-1 left-3 -translate-y-1/2 rounded-md border border-[#4FD1C5] bg-white px-2 py-1 font-medium">
                    {data?.ner}
                  </div>
                  <div className="absolute -bottom-2 left-3 flex gap-2 rounded-md border border-[#4FD1C5] bg-white px-2 py-1 text-xs font-medium">
                    <div className="text-green-500">
                      {moment(data.ekhlekhOgnoo).format("YYYY-MM-DD")} --{" "}
                      {moment(data.duusakhOgnoo).format("YYYY-MM-DD")}, {"  "}
                    </div>
                    <div className="text-blue-500">
                      {moment(data.ekhlekhTsag).format("HH:mm")} --{" "}
                      {moment(data.duusakhTsag).format("HH:mm")}
                    </div>
                  </div>
                  <div className="text-center text-blue-500">Нөхцөл</div>
                  <div className="text-center text-green-500">Урамшуулал</div>
                  <div className="relative flex flex-col justify-center gap-2 py-2 text-[#4FD1C5]">
                    <DoubleRightOutlined className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-xl" />

                    {data.uramshuulaliinNukhtsul.map((nukhtsul, index) => (
                      <div
                        key={index}
                        className="mr-5 flex items-center gap-2 text-xs font-medium dark:text-gray-200 text-gray-800 "
                      >
                        -
                        <Popover
                          zIndex={9999}
                          content={
                            <div className="text-xs">
                              <div className="mb-3 flex gap-2">
                                Бар код:{" "}
                                <div className="text-blue-500">
                                  {nukhtsul?.barCode}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                Дотоод код:{" "}
                                <div className="text-blue-500">
                                  {nukhtsul?.baraaniiDotoodCode}
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <div className="cursor-pointer truncate px-0 text-blue-500">
                            {" "}
                            {nukhtsul.baraaniiNer}
                          </div>
                        </Popover>{" "}
                        <CloseOutlined className="text-xs" />{" "}
                        <div>{nukhtsul.too}</div>
                      </div>
                    ))}
                  </div>
                  <div className="relative flex flex-col justify-center py-2">
                    {data.uramshuulaliinBeleg.map((beleg, index) => (
                      <div
                        key={index}
                        className="ml-5 flex items-center gap-2 text-xs font-medium text-gray-800 dark:text-gray-200"
                      >
                        -
                        <Popover
                          zIndex={9999}
                          content={
                            <div className="text-xs">
                              <div className="mb-3 flex gap-2">
                                Бар код:{" "}
                                <div className="text-green-500">
                                  {beleg?.barCode}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                Дотоод код:{" "}
                                <div className="text-green-500">
                                  {beleg?.baraaniiDotoodCode}
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <div className="cursor-pointer truncate px-0 text-green-500">
                            {" "}
                            {beleg.baraaniiNer}
                          </div>
                        </Popover>{" "}
                        <CloseOutlined className="text-xs" />{" "}
                        <div>{beleg.too}</div>
                      </div>
                    ))}
                  </div>
                  {!zuvhunKharakh && posEsekh === true ? (
                    <div
                      className={`absolute -bottom-3 right-3 flex ${
                        Number(moment(data.duusakhTsag).format("HHmm")) <
                          Number(moment(new Date()).format("HHmm")) ||
                        Number(moment(data.ekhlekhTsag).format("HHmm")) >
                          Number(moment(new Date()).format("HHmm"))
                          ? "opacity-40"
                          : ""
                      }`}
                    >
                      <Button
                        disabled={
                          Number(moment(data.duusakhTsag).format("HHmm")) <
                            Number(moment(new Date()).format("HHmm")) ||
                          Number(moment(data.ekhlekhTsag).format("HHmm")) >
                            Number(moment(new Date()).format("HHmm"))
                        }
                        onClick={() => {
                          uramshuulalOruulakh(data.uramshuulaliinNukhtsul);
                          setUramshuulal([]);
                        }}
                        type="primary"
                      >
                        Урамшуулал оруулах
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div>
      </Modal>
    </>
  );
}
export default UramshuulalModal;
