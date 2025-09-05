import React, { useEffect, useMemo, useState } from "react";
import { Tree, Popover, Popconfirm } from "antd";
import {
  CarryOutOutlined,
  DeleteOutlined,
  MoreOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Table from "components/ant/AntdTable";
import DansNemekhModal from "components/modalBody/yrunhiiJurnal/dansniiTuluvluguu/dansNemekh";
import useJagsaalt from "hooks/posUseJagsaalt";
import { useAuth } from "services/auth";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import deleteMethod from "tools/function/crud/posDeleteMethod";
import BaganiinSongolt from "components/baganaNemekh";
import DansNemekhExcel from "components/modalBody/yrunhiiJurnal/dansniiTuluvluguu/dansNemekhExcel";
import { Modal } from "components/ant/AntdModal";
import { Button } from "components/ant/AntdButton";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import { Input } from "components/ant/AntdInput";
import _ from "lodash";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

const { TreeNode } = Tree;
const order = { code: 1 };
const searchKey = ["ner", "code"];

function tolgoiBulegChildBulgiinIdYalgajAvakh(data) {
  let result = [];

  data?.forEach((item) => {
    let obj = { tolgoinId: item?._id, childrenId: [] };

    function idTsugluulakh(parent, children) {
      children?.forEach((child) => {
        parent?.childrenId?.push(child._id);
        if (child?.dedBuleg?.length > 0) {
          idTsugluulakh(parent, child?.dedBuleg);
        }
      });
    }

    idTsugluulakh(obj, item?.dedBuleg);

    result.push(obj);
  });

  return result;
}

const DansniiTuluvluguu = () => {
  const { salbariinId, baiguullagiinId, token } = useAuth();
  const [shineBagana, setShineBagana] = useState([]);
  const [songogdsonBulegId, setSongogdsonBulegId] = useState([]);
  const [songogdsonBulegNer, setSongogdsonBulegNer] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [bulegUstgakhId, setBulegUstgakhId] = useState();
  const [tolgoiBulegChildIdtaiga, setTolgoiBulegChildIdtaiga] = useState();

  const [zasakhBulgiinId, setZasakhBulgiinId] = useState();
  const [zasakhNer, setZasakhNer] = useState("");
  const [nemekhBulgiinParendId, setNemekhBulgiinParendId] = useState("");
  const [nemekhBulgiinNer, setNemekhBulgiinNer] = useState("");

  function tolgoiBulgiinIdOlokh(bulgiinId) {
    var parentMunEsekh = dansniiBulegData.jagsaalt.filter(
      (e) => e?._id === bulgiinId
    );

    if (!!parentMunEsekh?.[0]?._id) {
      return parentMunEsekh?.[0]?._id;
    } else {
      for (let item of tolgoiBulegChildIdtaiga) {
        if (item.childrenId.includes(bulgiinId)) {
          return item.tolgoinId;
        }
      }
      return null;
    }
  }

  function bulegZasakh(turul) {
    let tomBulgiinId = tolgoiBulgiinIdOlokh(
      turul === "zasakh"
        ? zasakhBulgiinId
        : turul === "uusgekh"
        ? nemekhBulgiinParendId
        : bulegUstgakhId
    );

    let yavuulakhData = dansniiBulegData.jagsaalt.filter(function f(o) {
      if (turul === "zasakh") {
        if (o._id !== zasakhBulgiinId) {
          if (!!o.dedBuleg) {
            return (o.dedBuleg = o.dedBuleg.filter(f));
          }
          return true;
        } else {
          o.ner = zasakhNer;
          return true;
        }
      } else if (turul === "uusgekh") {
        if (o._id !== nemekhBulgiinParendId) {
          if (!!o.dedBuleg) {
            return (o.dedBuleg = o.dedBuleg.filter(f));
          }
          return true;
        } else {
          o.dedBuleg = [
            ...o.dedBuleg,
            {
              ner: nemekhBulgiinNer,
              dedBuleg: [],
            },
          ];
          return true;
        }
      } else {
        if (o._id !== bulegUstgakhId) {
          if (!!o.dedBuleg) {
            return (o.dedBuleg = o.dedBuleg.filter(f));
          }
          return true;
        }
      }
    });

    yavuulakhData = yavuulakhData.filter((e) => e._id === tomBulgiinId);

    if (turul === "uusgekh" && nemekhBulgiinNer === "") {
      AnkhaaruulgaAlert("Бүлгийн нэр оруулна уу.");
    } else {
      posUilchilgee(token)
        .put("/dansniiBuleg/" + tomBulgiinId, ...yavuulakhData)
        .then((khariu) => {
          if (khariu.data === "Amjilttai") {
            dansniiBulegMutate();
            AmjilttaiAlert("Амжилттай");
            setBulegUstgakhId();

            setZasakhNer("");
            setZasakhBulgiinId();

            setNemekhBulgiinNer("");
            setNemekhBulgiinParendId();
          }
        })
        .catch((e) => aldaaBarigch(e));
    }
  }

  const treeNodeZagvar = (data) => {
    if (!data || !data || data?.length === 0) {
      return null;
    }

    return data?.map((item) => {
      const handleExpandParent = (parentKey) => {
        setExpandedKeys((prevExpandedKeys) => {
          if (!prevExpandedKeys.includes(parentKey)) {
            return [...prevExpandedKeys, parentKey];
          }
          return prevExpandedKeys;
        });
      };
      return (
        <TreeNode
          title={
            <div className="flex !w-full items-center justify-between">
              {zasakhBulgiinId === item._id ? (
                <div className="w-[80%]">
                  <Input
                    autoFocus={true}
                    value={zasakhNer}
                    className={"!border-none"}
                    placeHolder={item.ner}
                    onChange={(v) => setZasakhNer(v.target.value)}
                  />
                </div>
              ) : (
                <div className="!w-[80%]">{item?.ner}</div>
              )}
              {zasakhBulgiinId === item._id ? (
                <div className="absolute right-0">
                  <div className="flex gap-2">
                    <CloseOutlined
                      className="!text-red-700"
                      onClick={() => {
                        setZasakhBulgiinId();
                        setZasakhNer("");
                      }}
                    />
                    <CheckOutlined
                      className="!text-green-400"
                      onClick={() => bulegZasakh("zasakh")}
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute right-0">
                  <Popover
                    content={
                      <div>
                        <div
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-full p-2 text-green-700  hover:bg-gray-200"
                          onClick={() => {
                            setNemekhBulgiinParendId(item?._id);
                            handleExpandParent(item?.ner);
                          }}
                        >
                          <PlusOutlined style={{ color: "green" }} />
                          Нэмэх
                        </div>
                        <div
                          className="text-red-green flex cursor-pointer items-center justify-center gap-2 rounded-full p-2 hover:bg-gray-200"
                          onClick={() => setBulegUstgakhId(item?._id)}
                        >
                          <DeleteOutlined style={{ color: "red" }} />
                          Устгах
                        </div>
                        <div
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-full p-2  hover:bg-gray-200"
                          onClick={() => {
                            setZasakhBulgiinId(item?._id);
                            setZasakhNer(item.ner);
                          }}
                        >
                          <EditOutlined />
                          Засах
                        </div>
                      </div>
                    }
                  >
                    <MoreOutlined />
                  </Popover>
                </div>
              )}
            </div>
          }
          key={item?.ner}
        >
          {nemekhBulgiinParendId === item._id && (
            <TreeNode
              checkable={false}
              title={
                <div className="flex !w-full items-center justify-between">
                  <div className="w-[80%]">
                    <Input
                      autoFocus={true}
                      value={nemekhBulgiinNer}
                      onChange={(v) => setNemekhBulgiinNer(v.target.value)}
                      className={"!border-none"}
                      placeHolder={"Шинэ бүлэг"}
                    />
                  </div>
                  <div className="flex gap-2">
                    <CloseOutlined
                      className="!text-red-700"
                      onClick={() => {
                        setNemekhBulgiinParendId();
                        setNemekhBulgiinNer("");
                      }}
                    />
                    <CheckOutlined
                      className="!text-green-400"
                      onClick={() => bulegZasakh("uusgekh")}
                    />
                  </div>
                </div>
              }
              key={"shineBuleg"}
            />
          )}
          {item?.dedBuleg?.length > 0 && treeNodeZagvar(item?.dedBuleg)}
        </TreeNode>
      );
    });
  };

  const queryJurnalDans = useMemo(() => {
    var result = {
      baiguullagiinId: baiguullagiinId,
    };
    // if (songogdsonBulegNer.length > 0) {
    //   result.buleg = songogdsonBulegNer;
    // }
    if (songogdsonBulegId.length > 0) {
      result.buleg = { $in: songogdsonBulegId.map((a) => a) };
    }
    return result;
  }, [baiguullagiinId, songogdsonBulegNer]);

  const queryDansniiBuleg = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
    }),
    [baiguullagiinId]
  );

  const {
    data: jurnalDansData,
    refresh,
    setKhuudaslalt,
    isValidating,
  } = useJagsaalt("/jurnalDans", queryJurnalDans, order, undefined, searchKey);

  const { data: dansniiBulegData, refresh: dansniiBulegMutate } = useJagsaalt(
    "/dansniiBuleg",
    queryDansniiBuleg
  );

  useEffect(() => {
    const buhNer = [];
    dansniiBulegData?.jagsaalt?.forEach((item) => {
      const nerBarikh = (data) => {
        data.forEach((entry) => {
          buhNer?.push(entry?.ner);
          if (entry?.dedBuleg?.length > 0) {
            nerBarikh(entry?.dedBuleg);
          }
        });
      };
      nerBarikh(item?.dedBuleg);
    });
    setExpandedKeys(buhNer);

    setTolgoiBulegChildIdtaiga(
      tolgoiBulegChildBulgiinIdYalgajAvakh(dansniiBulegData?.jagsaalt)
    );
    const updateNerValues = (data, newNerValue) => {
      data.forEach((item) => {
        item.ner = newNerValue;
        if (item.dedBuleg && item.dedBuleg.length > 0) {
          updateNerValues(item.dedBuleg, newNerValue);
        }
      });
    };
  }, [dansniiBulegData?.jagsaalt]);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (selectedKeysValue, info) => {
    setSongogdsonBulegId(selectedKeysValue);
    setSongogdsonBulegNer((prev) => {
      if (prev.some((item) => item === info?.node?.key)) {
        const updatedNer = prev.filter((item) => item !== info?.node?.key);
        return [...updatedNer];
      } else {
        return [...prev, info?.node?.key];
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        title: <div className="">№</div>,
        dataIndex: "desDugaar",
        key: "desDugaar",
        align: "center",
        width: "2.5rem",
        fixed: "left",
        render: (text, record, index) => {
          const dugaar =
            (jurnalDansData?.khuudasniiDugaar || 0) *
              (jurnalDansData?.khuudasniiKhemjee || 0) -
            (jurnalDansData?.khuudasniiKhemjee || 0) +
            index +
            1;

          return <div className="text-center">{dugaar}</div>;
        },
      },
      {
        title: <div className="">Дансны код</div>,
        key: "code",
        dataIndex: "code",
        align: "center",
        width: "8rem",
        fixed: "left",
        render: (code, data) => {
          return (
            <div className={`${data?.valyut === "USD" && "text-blue-500"}`}>
              {code}
            </div>
          );
        },
      },
      {
        title: <div className="">Дансны нэр</div>,
        key: "ner",
        align: "center",
        width: "20rem",
        dataIndex: "ner",
        fixed: "left",
        render: (ner, data) => {
          return (
            <div className={`${data?.valyut === "USD" && "text-blue-500"}`}>
              {
                <div className="dark:text-gray-200">
                  <Popover title={false} content={<div>{ner}</div>}>
                    <div className="truncate text-left dark:text-gray-200">
                      {ner}
                    </div>
                  </Popover>
                </div>
              }
            </div>
          );
        },
      },
      {
        title: <div className="">Валют</div>,
        key: "Валют",
        width: "9rem",
        dataIndex: "valyut",
        align: "center",
        render: (valyut, data) => {
          return (
            <div className={`${data?.valyut === "USD" && "text-blue-500"}`}>
              {valyut}
            </div>
          );
        },
      },
      {
        title: <div className="">Бүлэг</div>,
        key: "buleg",
        width: "15rem",
        dataIndex: "buleg",
        align: "center",
        render: (buleg, data) => {
          return (
            <div className="">
              <Popover title={false} content={<div>{buleg}</div>}>
                <div
                  className={`${data?.valyut === "USD" && "text-blue-500 "}`}
                >
                  <div className="truncate text-left ">{buleg}</div>
                </div>
              </Popover>
            </div>
          );
        },
      },
      {
        title: <div className="">Эхний үлдэгдэл</div>,
        key: "ekhniiUldegdel",
        width: "10rem",
        dataIndex: "ekhniiUldegdel",
        align: "center",
        render: (ekhniiUldegdel, data) => {
          return (
            <div className={`${data?.valyut === "USD" && "text-blue-500"}`}>
              <div className="text-right">
                {formatNumber(ekhniiUldegdel, 2)}
              </div>
            </div>
          );
        },
      },
      {
        title: <div className="">Дансны шинж</div>,
        key: "shinjChanar",
        width: "10rem",
        dataIndex: "shinjChanar",
        align: "center",
        render: (shinjChanar, data) => {
          return (
            <div className={`${data?.valyut === "USD" && "text-blue-500"}`}>
              {shinjChanar}
            </div>
          );
        },
      },
      ...shineBagana,
      {
        title: "",
        width: "2rem",
        key: "_id",
        dataIndex: "_id",
        align: "center",
        render: (v, data) => {
          return (
            <Popover
              trigger={"hover"}
              placement="bottom"
              content={
                <div className="flex w-20 flex-col gap-2 space-y-2">
                  <Popconfirm
                    title={<div>Данс устгах уу?</div>}
                    okText={
                      <div
                        onClick={() =>
                          deleteMethod("jurnalDans", token, v).then(
                            ({ data }) => {
                              if (data === "Amjilttai") {
                                refresh();
                                AmjilttaiAlert("Амжилттай устгалаа");
                              }
                            }
                          )
                        }
                      >
                        Тийм
                      </div>
                    }
                    cancelText="Үгүй"
                  >
                    <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100">
                      <DeleteOutlined
                        style={{ fontSize: "18px", color: "red" }}
                      />
                      <label>Устгах</label>
                    </a>
                  </Popconfirm>
                  <DansNemekhModal
                    mutate={refresh}
                    turul={"zasah"}
                    zasahData={data}
                    dansniiBulegMutate={dansniiBulegMutate}
                  />
                </div>
              }
            >
              <MoreOutlined className="cursor-pointer" />
            </Popover>
          );
        },
      },
    ],
    [shineBagana, jurnalDansData]
  );

  return (
    <Admin
      onSearch={(v) =>
        setKhuudaslalt((a) => ({
          ...a,
          search: v,
          khuudasniiDugaar: 1,
        }))
      }
      khuudasniiNer={"dansniiTuluvluguu"}
      className={"p-4"}
      title={"Дансны төлөвлөгөө"}
    >
      <div className="col-span-full flex w-full flex-col">
        <div className="flex h-full w-full">
          <div className=" h-[90vh] !min-w-[300px] overflow-scroll border border-gray-200 bg-white dark:border-gray-900 dark:bg-gray-800">
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={songogdsonBulegId}
              defaultExpandAll
              className="dark:bg-gray-800 dark:text-gray-300 dark:[&_.ant-tree-node-content-wrapper]:hover:bg-gray-700"
            >
              {treeNodeZagvar(dansniiBulegData?.jagsaalt)}
            </Tree>
          </div>
          <div className="flex w-[calc(90vw-15rem)] flex-col gap-2 dark:bg-gray-800">
            <div className="flex w-full justify-end gap-2">
              <DansNemekhExcel mutate={refresh} />
              <DansNemekhModal
                mutate={refresh}
                dansniiBulegMutate={dansniiBulegMutate}
              />
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: <div className="">Туслах журнал</div>,
                    key: "tuslakh",
                    dataIndex: "tuslakh",
                    width: "140px",
                    align: "center",
                    render: (tuslakh, data) => {
                      return (
                        <div className="">
                          <Popover title={false} content={<div>{tuslakh}</div>}>
                            <div
                              className={`${
                                data?.valyut === "USD" && "text-blue-500"
                              }`}
                            >
                              <div className="truncate text-left">
                                {tuslakh}
                              </div>
                            </div>
                          </Popover>
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Дансны төрөл</div>,
                    key: "dansniiTurul",
                    dataIndex: "dansniiTurul",
                    width: "140px",
                    align: "center",
                    render: (dansniiTurul, data) => {
                      return (
                        <div className="">
                          <Popover
                            title={false}
                            content={<div>{dansniiTurul}</div>}
                          >
                            <div
                              className={`${
                                data?.valyut === "USD" && "text-blue-500"
                              }`}
                            >
                              <div className="truncate text-left">
                                {dansniiTurul}
                              </div>
                            </div>
                          </Popover>
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Хэлтэс тасаг</div>,
                    key: "heltesTasag",
                    dataIndex: "heltesTasag",
                    align: "center",
                    width: "140px",
                    render: (heltesTasag, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {heltesTasag}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Санхүүгийн байдлын тайлан</div>,
                    key: "sankhuuBaidal",
                    dataIndex: "sankhuuBaidal",
                    width: "240px",
                    align: "center",
                    render: (sankhuuBaidal, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {data?.sankhuuBaidal}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Орлогын дэлгэрэнгүй тайлан</div>,
                    key: "orlogo",
                    dataIndex: "orlogo",
                    width: "240px",
                    align: "center",
                    render: (orlogo, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {data?.orlogo}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">ААНӨАТ-н тайлан</div>,
                    key: "aanoat",
                    dataIndex: "aanoat",
                    width: "200px",
                    align: "center",
                    render: (aanoat, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {data?.aanoat}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Үүсгэгдсэн</div>,
                    key: "createdAt",
                    dataIndex: "createdAt",
                    width: "200px",
                    align: "center",
                    render: (createdAt, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {moment(createdAt).format("YYYY-MM-DD HH:mm")}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Үүсгэсэн</div>,
                    key: "uusgesen",
                    dataIndex: "uusgesen",
                    width: "200px",
                    align: "center",
                    render: (uusgesen, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {uusgesen}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Өөрчлөгдсөн</div>,
                    key: "uurchlugdsun",
                    dataIndex: "uurchlugdsun",
                    width: "200px",
                    align: "center",
                    render: (uurchlugdsun, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {uurchlugdsun}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Өөрчилсөн</div>,
                    key: "Uurchilsun",
                    dataIndex: "Uurchilsun",
                    width: "200px",
                    align: "center",
                    render: (Uurchilsun, data) => {
                      return (
                        <div
                          className={`${
                            data?.valyut === "USD" && "text-blue-500"
                          }`}
                        >
                          {Uurchilsun}
                        </div>
                      );
                    },
                  },
                ]}
              />
            </div>
            <Table
              pagination={{
                current: jurnalDansData?.khuudasniiDugaar,
                pageSize: jurnalDansData?.khuudasniiKhemjee,
                total: jurnalDansData?.niitMur,
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
              size="small"
              unshijBaina={isValidating}
              bordered={true}
              // rowClassName="!testtes"
              dataSource={jurnalDansData?.jagsaalt}
              scroll={{ y: "calc(90vh - 10rem)", x: "calc(80vw - 18rem)" }}
              columns={columns}
            />
          </div>
        </div>
      </div>

      <Modal
        width={"438px"}
        okText="Бүртгэх"
        footer={false}
        header={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center font-normal">
            Та устгахдаа итгэлтэй байна уу?
          </div>
        }
        open={!!bulegUstgakhId}
        onCancel={() => setBulegUstgakhId()}
      >
        <div className="flex w-full justify-end gap-3">
          <Button type="default" onClick={() => setBulegUstgakhId()}>
            Үгүй
          </Button>
          <Button onClick={() => bulegZasakh("ustgakh")} type="primary">
            Тийм
          </Button>
        </div>
      </Modal>
    </Admin>
  );
};
export const getServerSideProps = shalgaltKhiikh;

export default DansniiTuluvluguu;
