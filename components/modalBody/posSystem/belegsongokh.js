import { Button, Checkbox, Popover } from "antd";
import { Modal } from "components/ant/AntdModal";
import React from "react";

function BelegSongokhModal({
  setSongokhBelegnuud,
  songokhBelegnuud,
  setSongogdsonBelegnuud,
  songogdsonBelegnuud,
  uramshuulalShalgakh,
  songogdsomEmnuud,
}) {
  return (
    <>
      <Modal
        zIndex={9999}
        width={"580px"}
        okText={false}
        footer={
          <div className="flex w-full justify-between">
            <Button
              onClick={() => {
                var belegnuud = songogdsonBelegnuud.filter(
                  (b) =>
                    !songokhBelegnuud?.find((a) => a.id === b.uramshuulaliinId)
                );
                setSongogdsonBelegnuud(belegnuud);
                setSongokhBelegnuud([]);
              }}
              style={{ width: "130px", height: "36px" }}
            >
              Хаах
            </Button>
            <Button
              type="primary"
              onClick={() => {
                uramshuulalShalgakh(songogdsomEmnuud);
                setSongokhBelegnuud([]);
              }}
              style={{ width: "130px", height: "36px" }}
            >
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div>Урамшуулал сонгох</div>}
        open={songokhBelegnuud.length > 0}
        onCancel={() => {
          var belegnuud = songogdsonBelegnuud.filter(
            (b) => !songokhBelegnuud?.find((a) => a.id === b.uramshuulaliinId)
          );
          setSongogdsonBelegnuud(belegnuud);
          setSongokhBelegnuud([]);
        }}
      >
        <div className="  flex flex-col items-center gap-8 px-1 py-3">
          {songokhBelegnuud.map((data, index) => (
            <div
              key={index}
              className="relative grid w-full grid-cols-2 gap-3 rounded-lg border border-[#4FD1C5] p-3 py-5"
            >
              <div className="absolute left-3 top-0 -translate-y-1/2 rounded-lg border border-[#4FD1C5] bg-white px-2">
                {data?.ner}
              </div>
              {data?.belegnuud?.map((a, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (
                      !!songogdsonBelegnuud.find(
                        (c) =>
                          c.uramshuulaliinId === data.id && c.code === a.code
                      )
                    ) {
                      var belegnuud = songogdsonBelegnuud.filter(
                        (b) =>
                          b.uramshuulaliinId !== data.id ||
                          (b.uramshuulaliinId === data.id && b.code !== a.code)
                      );
                      setSongogdsonBelegnuud(belegnuud);
                    } else {
                      songogdsonBelegnuud.push(a);
                      setSongogdsonBelegnuud([...songogdsonBelegnuud]);
                    }
                  }}
                  className={`${
                    !!songogdsonBelegnuud.find(
                      (c) => c.uramshuulaliinId === data.id && c.code === a.code
                    )
                      ? "bg-[#4FD1C5] bg-opacity-20"
                      : ""
                  } col-span-2 flex cursor-pointer select-none rounded-lg border border-[#4FD1C5] p-2 text-sm transition-all`}
                >
                  <Popover
                    placement="left"
                    zIndex={9999}
                    content={
                      <div className="">
                        <div className="flex gap-2">
                          Нэр: <div className="text-green-500">{a.ner}</div>
                        </div>{" "}
                        <div className="flex gap-2">
                          Дотоод код:{" "}
                          <div className="text-green-500">{a.code}</div>
                        </div>
                      </div>
                    }
                  >
                    <div className="w-2/3 select-none truncate border-r">
                      <Checkbox
                        checked={
                          !!songogdsonBelegnuud.find(
                            (c) =>
                              c.uramshuulaliinId === data.id &&
                              c.code === a.code
                          )
                        }
                      />{" "}
                      {a.ner}
                    </div>
                  </Popover>
                  <div className=" flex items-end gap-2 truncate pl-2 text-xs">
                    Урамшуулалд өгөх тоо:{" "}
                    <div className=" text-sm leading-4 text-green-500">
                      {a.shirkheg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
export default BelegSongokhModal;
