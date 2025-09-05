import React from "react";
import { Menu, Checkbox, Popover, Button } from "antd";
import { CheckOutlined, UnorderedListOutlined } from "@ant-design/icons";

const BaganiinSongolt = ({
  columns,
  shineBagana,
  setShineBagana,
  className,
}) => {
  React.useEffect(() => {
    const baganuud = localStorage.getItem("bagana-" + window.location.href);
    if (!!baganuud)
      setShineBagana(
        columns.filter((a) => {
          let parsedBaganuud = JSON.parse(baganuud);
          return parsedBaganuud.find(
            (b) => JSON.stringify(b) === JSON.stringify(a.dataIndex)
          );
        })
      );
  }, []);

  function baganaNemekh(e, mur) {
    var jagsaalt = shineBagana;
    if (
      !shineBagana.find(
        (a) => JSON.stringify(a.dataIndex) === JSON.stringify(mur.dataIndex)
      )
    ) {
      var nemekhBagana = {
        ellipsis: true,
        showSorterTooltip: false,
        ...mur,
      };
      jagsaalt.push(nemekhBagana);
    } else
      jagsaalt = shineBagana.filter(function (item) {
        return JSON.stringify(item.dataIndex) !== JSON.stringify(mur.dataIndex);
      });

    localStorage.setItem(
      "bagana-" + window.location.href,
      JSON.stringify(jagsaalt.map((a) => JSON.stringify(a.dataIndex)))
    );
    setShineBagana([...jagsaalt]);
  }

  return (
    <div className={className}>
      <Popover
        content={() => (
          <div className=" flex flex-col gap-2">
            {columns.map((mur, i) => (
              <div
                onClick={(e) => baganaNemekh(e, mur)}
                className={`mx-2 flex cursor-pointer items-center justify-between rounded-[10px] border-[1px] border-[#4FD1C5] px-2 py-2 ${
                  !!shineBagana.find(
                    (a) =>
                      JSON.stringify(a.dataIndex) ===
                      JSON.stringify(mur.dataIndex)
                  )
                    ? "selected-option"
                    : ""
                }`}
                key={"bagana-" + i}
              >
                <div className="flex !items-center justify-between px-2 !text-center">
                  {mur.title}
                </div>
                <div
                  className={`songgogdsonV first-letter: !flex h-[17px] w-[17px] items-center justify-center rounded-full border-[1px] border-[#4FD1C5] ${
                    !!shineBagana.find(
                      (a) =>
                        JSON.stringify(a.dataIndex) ===
                        JSON.stringify(mur.dataIndex)
                    ) && "bg-[#4FD1C5]"
                  }`}
                >
                  {!!shineBagana.find(
                    (a) =>
                      JSON.stringify(a.dataIndex) ===
                      JSON.stringify(mur.dataIndex)
                  ) && 
                  (
                    <CheckOutlined
                      style={{ color: "white" }}
                      className="text-[8px]"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        style={{ padding: 0 }}
        placement="bottom"
        trigger="click"
      >
        <Button
          className="flex h-full w-full items-center justify-center"
          style={{ backgroundColor: "#1890ff" }}
          type="primary"
        >
          <UnorderedListOutlined
            className=" text-sm text-green-700"
            style={{ color: "white" }}
          />
          <span className="text-white">Багана</span>
        </Button>
      </Popover>
    </div>
  );
};
export default BaganiinSongolt;
