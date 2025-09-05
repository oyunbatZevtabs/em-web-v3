import { Button, Checkbox, Form, Input, message } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useState } from "react";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import { useAuth } from "services/auth";
import useBaraa from "hooks/useBaraa";
import formatNumber from "tools/function/formatNumber";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import moment from "moment";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import OrluulakhEmSongokh from "./orluulakhEmSongokh";

const order = { createdAt: -1 };

function TsahimJorModal({
  setShineSongogdsomEmnuud,
  shineSongogdsomEmnuud,
  setHungulsunBaraa,
  setShineerBarimtiinDugaarAviya,
  shineerBarimtiinDugaarAviya,
  hynaltiinDugaaraarLavlagaaAvakhData,
  setHynaltiinDugaaraarLavlagaaAvakhData,
  form,
  setSongogdsomEmnuud,
  songogdsomEmnuud,
  setGuilgeeniiDugaar,
}) {
  const { token, baiguullagiinId, salbariinId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCancel() {
    setIsModalOpen(false);
    setHynaltiinDugaaraarLavlagaaAvakhData();
    form.resetFields();
  }

  function handleOpen() {
    setIsModalOpen(true);
    setHynaltiinDugaaraarLavlagaaAvakhData();
    form.resetFields();
  }

  useKeyboardTovchlol("F2", f2Darsan);
  function f2Darsan() {
    handleOpen();
  }

  const query = useMemo(() => {
    if (!!hynaltiinDugaaraarLavlagaaAvakhData) {
      const packGroupeerOldsonBaraanuudArray = [];
      for (const receiptDetail of hynaltiinDugaaraarLavlagaaAvakhData?.receiptDetails) {
        packGroupeerOldsonBaraanuudArray.push(
          ...receiptDetail.packGroupeerOldsonBaraanuud
        );
      }
      const tbltBarCodes = packGroupeerOldsonBaraanuudArray.map(
        (item) => item.tbltBarCode
      );
      return {
        barCode: {
          $in: tbltBarCodes,
        },
        uldegdel: {
          $gt: 0,
        },
      };
    }
    return;
  }, [hynaltiinDugaaraarLavlagaaAvakhData]);

  const orluulakhEmnuud = useMemo(() => {
    // if (!!hynaltiinDugaaraarLavlagaaAvakhData) {
    return {
      emdOrluulakh: {
        $in: true,
      },
    };
    // }
  }, [hynaltiinDugaaraarLavlagaaAvakhData]);

  const { baraaGaralt: orluulakhEm } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    orluulakhEmnuud,
    order
  );

  const { baraaGaralt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    query,
    order
  );

  function capitalizeFirstLetter(word) {
    return word.at(0)?.toUpperCase() + word.slice(1).toLowerCase() || " ";
  }

  function emdKhunglultuusEmOruulakh(value) {
    console.log("------ em ------->>" + JSON.stringify(value));
    if (
      value.shirkheglekhEsekh &&
      value.tbltSize > value.uldegdel * value.negKhairtsaganDahiShirhegiinToo
    ) {
      AnkhaaruulgaAlert("Хайрцагтай барааны үлдэгдэл хүрэлцэхгүй байна!");
      return;
    }
    hynaltiinDugaaraarLavlagaaAvakhData.status =
      value.khunglukhEsekh === true
        ? 1
        : hynaltiinDugaaraarLavlagaaAvakhData.status;
    var sortolson = value.tsuvral.sort((a, b) =>
      moment(a?.duusakhOgnoo || a?.huleejAvsanOgnoo).isBefore(
        moment(b?.duusakhOgnoo || b?.huleejAvsanOgnoo)
      )
        ? -1
        : 1
    );
    if (value.khunglukhEsekh) {
      if (
        value.shirkheglekhEsekh &&
        (!value.negKhairtsaganDahiShirhegiinToo ||
          value.negKhairtsaganDahiShirhegiinToo === 0)
      ) {
        AnkhaaruulgaAlert("Ширхэгийн тоогоо оруулна уу!");
        return;
      }
      if (
        value.shirkheglekhEsekh &&
        !!value.negKhairtsaganDahiShirhegiinToo &&
        value.negKhairtsaganDahiShirhegiinToo > 0
      ) {
        var tempnegUne =
          value.niitUne / Number(value.negKhairtsaganDahiShirhegiinToo || 1); // 30000/30 = 1000
        tempnegUne =
          tempnegUne < value.tsahimJorUne ? tempnegUne : value.tsahimJorUne; // 1000 < 1500
        value.niitUne = value.negKhairtsaganDahiShirhegiinToo * tempnegUne;
      } else
        value.niitUne =
          value.niitUne < value.tsahimJorUne
            ? value.niitUne
            : value.tsahimJorUne;
    }
    value.shirkheg =
      value.shirkheglekhEsekh && value.tbltSize > 0
        ? value.tbltSize / Number(value.negKhairtsaganDahiShirhegiinToo || 1)
        : 1;
    value.hungulsunDun =
      Number(value.hungulsunDunTsahimJor || 0) *
      (value.shirkheglekhEsekh && value.tbltSize > 0 ? value.tbltSize : 1);
    console.log("---hungulsunDun-------->" + value.hungulsunDun);
    value.zarsanNiitUne = value.niitUne * value.shirkheg - value.hungulsunDun;
    console.log("---zarsanNiitUne-------->" + value.zarsanNiitUne);

    if (shineSongogdsomEmnuud?.some((obj) => obj?.barCode === value?.barCode)) {
      const updatedSongogdsomEmnuud = shineSongogdsomEmnuud?.filter(
        (obj) => obj?.barCode !== value?.barCode
      );

      setShineSongogdsomEmnuud(updatedSongogdsomEmnuud || []);
    } else if (
      shineSongogdsomEmnuud?.some((obj) => obj?.packGroup === value?.packGroup)
    ) {
      const updatedSongogdsomEmnuud = shineSongogdsomEmnuud?.filter(
        (obj) => obj?.packGroup !== value?.packGroup
      );
      (value.ognooniiMedeelelBurtgekhEsekh || value.tsuvraliinDugaartaiEsekh) &&
        (value.zarakhTsuvral = value.tsuvral.map((tsu) => {
          const { uldegdel, ...restTsu } = tsu;
          return {
            ...restTsu,
            too: 0,
          };
        }));

      updatedSongogdsomEmnuud?.push(value);
      setShineSongogdsomEmnuud(
        updatedSongogdsomEmnuud,
        "updatedSongogdsomEmnuud"
      );
    } else {
      if (sortolson.length > 0) {
        const firstItem = sortolson[0];
        firstItem.too = 1;
        value.zarakhTsuvral = [firstItem];
      }
      setShineSongogdsomEmnuud([...shineSongogdsomEmnuud, value]);
    }
  }

  function hadgalahFunction() {
    if (!!shineSongogdsomEmnuud && shineSongogdsomEmnuud.length > 0) {
      const novartic = shineSongogdsomEmnuud.filter(
        (a) =>
          !!a.emiinTurulManufacture && a.emiinTurulManufacture === "НОВАРТИС"
      );
      const normal = shineSongogdsomEmnuud.filter(
        (a) => a.emiinTurulManufacture === null
      );
      if (!!novartic && novartic.length > 0 && !!normal && normal.length > 0)
        return AnkhaaruulgaAlert(
          "Новартис эм болон бусад эмийн төрөл байна. Зөвхөн новартис эм эсвэл бусад эмийн төрлөөр борлуулалт илгээнэ үү!!!"
        );
    }
    setSongogdsomEmnuud(shineSongogdsomEmnuud);
    setIsModalOpen(false);
    if (songogdsomEmnuud?.length === 0 && shineerBarimtiinDugaarAviya) {
      posUilchilgee(token)
        .post("/zakhialgiinDugaarAvya", {
          baiguullagiinId: baiguullagiinId,
        })
        .then(({ data }) => {
          if (data) {
            setGuilgeeniiDugaar(data);
            setShineerBarimtiinDugaarAviya(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    }
    if (shineSongogdsomEmnuud?.length === 0)
      setHynaltiinDugaaraarLavlagaaAvakhData();
  }

  return (
    <>
      <button
        type="primary"
        className=" flex h-12 w-full items-center justify-center rounded-2xl border border-[#4FD1C5] text-xl font-[600] shadow-md xl:h-12"
        onClick={() => handleOpen()}
      >
        <div className="truncate p-2 text-[15px] xl:text-[15px]">
          Цахим жор [F2]
        </div>
      </button>
      <Modal
        bodyStyle={{ padding: "0" }}
        destroyOnClose={true}
        width={"738px"}
        okText="Хайх"
        footer={
          <div className="flex w-full justify-end">
            {!!hynaltiinDugaaraarLavlagaaAvakhData && (
              <Button
                onClick={() => {
                  setHynaltiinDugaaraarLavlagaaAvakhData();
                  form.resetFields();
                }}
                style={{ width: "126px", height: "36px" }}
                type=""
              >
                Цэвэрлэх
              </Button>
            )}
            {!!hynaltiinDugaaraarLavlagaaAvakhData && (
              <Button
                onClick={hadgalahFunction}
                style={{ width: "126px", height: "36px" }}
                type="primary"
              >
                Захиалах
              </Button>
            )}
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">Цахим жор</div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
      >
        {/* <OrluulakhEmSongokh /> */}
        <Form
          onValuesChange={(changedValues, allValues) => {
            if (
              isModalOpen &&
              allValues?.khynaltiinDugaar?.length === 6 &&
              allValues?.register?.length === 10
            ) {
              clearTimeout(form.timeoutID);

              form.timeoutID = setTimeout(() => {
                var yavuulahData = allValues;
                yavuulahData.baiguullagiinId = baiguullagiinId;
                yavuulahData.salbariinId = salbariinId;
                posUilchilgee(token)
                  .post("/hynaltiinDugaaraarLavlagaaAvakh", yavuulahData)
                  .then(({ data }) => {
                    if (data) {
                      setHynaltiinDugaaraarLavlagaaAvakhData(data);
                    } else {
                      AnkhaaruulgaAlert("Лавлагаа олдсонгүй");
                      setHynaltiinDugaaraarLavlagaaAvakhData();
                    }
                  })
                  .catch((e) => {
                    aldaaBarigch(e);
                    setHynaltiinDugaaraarLavlagaaAvakhData();
                  });
              }, 1000);
            } else {
              setHynaltiinDugaaraarLavlagaaAvakhData();
            }
          }}
          autoComplete="off"
          labelAlign="right"
          form={form}
        >
          <div className="flex items-center justify-center gap-5">
            <Form.Item
              labelCol={{ span: 24 }}
              style={{ width: "45%" }}
              // rules={[
              //   {
              //     required: true,
              //     message: "* Жорын код оруулна уу!",
              //   },
              // ]}
              normalize={(input) => {
                const value = input.slice(0, 6);

                return `${value}`;
              }}
              label={<div className="dark:text-gray-300">Жорын код</div>}
              name={"khynaltiinDugaar"}
            >
              <Input
                style={{
                  height: "2.5rem",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Жорын код"
              />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              style={{ width: "45%" }}
              // rules={[
              //   {
              //     required: true,
              //     message: "* Регистр оруулна уу!",
              //   },
              // ]}
              normalize={(input) => {
                const too = input.replace(/[^0-9]/g, "").slice(0, 8);
                const useg = Array.from(input)
                  .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
                  .slice(0, 2)
                  .join("");
                return `${useg}${too}`?.toUpperCase() || " ";
              }}
              label={
                <div className="dark:text-gray-300">Регистрийн дугаар</div>
              }
              name={"register"}
            >
              <Input
                maxLength={10}
                style={{
                  height: "2.5rem",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Регистрийн дугаар"
              />
            </Form.Item>
          </div>
        </Form>
        {!!hynaltiinDugaaraarLavlagaaAvakhData && (
          <div className="flex flex-col px-5 dark:text-gray-200">
            <div className="flex justify-between">
              <div>Овог нэр:</div>
              <div className="flex gap-2">
                <div>
                  {capitalizeFirstLetter(
                    hynaltiinDugaaraarLavlagaaAvakhData?.patientLastName || " "
                  )}{" "}
                </div>
                <div>
                  {capitalizeFirstLetter(
                    hynaltiinDugaaraarLavlagaaAvakhData?.patientFirstName || " "
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>Өрхийн эмнэлэг сум, дүүрэг:</div>
              <div className="flex gap-2">
                <div>
                  {capitalizeFirstLetter(
                    hynaltiinDugaaraarLavlagaaAvakhData?.hosOfficeName || " "
                  )}{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>Өрхийн эмнэлгийн баг, хороо:</div>
              <div className="flex gap-2">
                <div>
                  {capitalizeFirstLetter(
                    hynaltiinDugaaraarLavlagaaAvakhData?.hosSubOffName || " "
                  )}{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>Өрхийн эмнэлгийн нэр:</div>
              <div className="flex gap-2">
                <div>
                  {capitalizeFirstLetter(
                    hynaltiinDugaaraarLavlagaaAvakhData?.hosName || " "
                  )}{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>Эмчийн шифр:</div>
              <div className="flex gap-2">
                <div>
                  {capitalizeFirstLetter(
                    hynaltiinDugaaraarLavlagaaAvakhData?.cipherCode || " "
                  )}{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>Дуусах огноо:</div>
              <div className="flex gap-2">
                <div>
                  {moment(
                    hynaltiinDugaaraarLavlagaaAvakhData?.receiptExpireDate
                  ).format("YYYY-MM-DD")}{" "}
                </div>
              </div>
            </div>
            <div className="mt-5 flex max-h-[300px] flex-col justify-between overflow-auto px-3 text-right">
              <div className="w-[100%]">
                <div className="bold text-center font-semibold">Эм</div>
                <div className="flex w-full flex-wrap">
                  {hynaltiinDugaaraarLavlagaaAvakhData?.receiptDetails?.map(
                    (el) => {
                      const packGroup = el.packGroup;
                      return (
                        <div
                          className="flex w-full flex-col border-b-2 pb-2"
                          key={packGroup}
                        >
                          <div className="flex w-full justify-between">
                            <div className="font-bold">{el.tbltName}:</div>
                            <div>
                              <div className="flex gap-2">
                                Эмчийн тайлбар: {el.tbltDesc}
                              </div>
                              <div>Эмийн ширхэгийн тоо: {el.tbltSize}</div>
                            </div>
                          </div>
                          <div className="flex w-full flex-wrap gap-11">
                            {baraaGaralt?.jagsaalt?.map((baraa) => {
                              return el?.packGroupeerOldsonBaraanuud?.map(
                                (element) => {
                                  return baraa.barCode ===
                                    element.tbltBarCode ? (
                                    <Checkbox
                                      key={element.tbltBarCode}
                                      onChange={() => {
                                        emdKhunglultuusEmOruulakh({
                                          ...baraa,
                                          zarsanNiitUne: baraa.niitUne,
                                          shirkheg: 0,
                                          khunglukhEsekh: true,
                                          hungulsunDunTsahimJor:
                                            element.tbltUnitDisAmt,
                                          emiinShirkhegiinKhunglukhDun:
                                            element.tbltUnitDisAmt,
                                          tsahimJorUne: element.tbltUnitPrice,
                                          detailId: el?.id,
                                          tbltId: element.id,
                                          packGroup: element.packGroup,
                                          productName:
                                            element.tbltNameSales +
                                            element.tbltSizeMixture,
                                          barCode: element.tbltBarCode,
                                          emiinTurulManufacture:
                                            element.tbltManufacture,
                                          tbltSize: el.tbltSize,
                                        });
                                      }}
                                      checked={shineSongogdsomEmnuud?.some(
                                        (obj) =>
                                          obj.barCode === element.tbltBarCode
                                      )}
                                      className="flex w-[140px] items-baseline align-baseline dark:text-gray-200"
                                    >
                                      {!!element.tbltManufacture ? (
                                        <div className="text-xl font-bold">
                                          {element.tbltManufacture}
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      <div className="text-xs">
                                        {element.tbltNameMon}
                                      </div>
                                      <div className="text-xs">
                                        {element.tbltBarCode}
                                      </div>
                                      <div className="text-xs">
                                        Хөнгөлөлтийн дүн:{" "}
                                        {formatNumber(
                                          element.tbltUnitDisAmt,
                                          2
                                        )}
                                        ₮
                                      </div>
                                      <div className="text-xs">
                                        Жорын үнэ:{" "}
                                        {formatNumber(element.tbltUnitPrice, 2)}
                                        ₮
                                      </div>
                                    </Checkbox>
                                  ) : null;
                                }
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col flex-wrap justify-between break-all">
              <div className="text-center font-semibold">Онош</div>
              <div>
                {hynaltiinDugaaraarLavlagaaAvakhData?.receiptDiag
                  .split("\n")
                  .map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* <div className="flex flex-col px-5">
          <div className="flex justify-between">
            <div>Овог нэр:</div>
            <div className="flex gap-2">
              <div>
                {capitalizeFirstLetter(
                  hynaltiinDugaaraarLavlagaaAvakhData?.patientLastName || " "
                )}{" "}
              </div>
              <div>
                {capitalizeFirstLetter(
                  hynaltiinDugaaraarLavlagaaAvakhData?.patientFirstName || " "
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>Өрхийн эмнэлэг сум, дүүрэг:</div>
            <div className="flex gap-2">
              <div>
                {capitalizeFirstLetter(
                  hynaltiinDugaaraarLavlagaaAvakhData?.hosOfficeName || " "
                )}{" "}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>Өрхийн эмнэлгийн баг, хороо:</div>
            <div className="flex gap-2">
              <div>
                {capitalizeFirstLetter(
                  hynaltiinDugaaraarLavlagaaAvakhData?.hosSubOffName || " "
                )}{" "}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>Өрхийн эмнэлгийн нэр:</div>
            <div className="flex gap-2">
              <div>
                {capitalizeFirstLetter(
                  hynaltiinDugaaraarLavlagaaAvakhData?.hosName || " "
                )}{" "}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>Эмчийн шифр:</div>
            <div className="flex gap-2">
              <div>
                {capitalizeFirstLetter(
                  hynaltiinDugaaraarLavlagaaAvakhData?.cipherCode || " "
                )}{" "}
              </div>
            </div>
          </div>
          <div className="mt-5 flex max-h-[300px] flex-col justify-between overflow-auto px-3 text-right">
            <div className="w-[100%]">
              <div className="bold text-center font-semibold">Эм</div>
              <div className="flex w-full flex-wrap">
                {hynaltiinDugaaraarLavlagaaAvakhData?.receiptDetails?.map(
                  (el) => {
                    const packGroup = el.packGroup;
                    return (
                      <div
                        className="flex w-full flex-col border-b-2 pb-2"
                        key={packGroup}>
                        <div className="flex w-full justify-between">
                          <div className="font-bold">{el.tbltName}:</div>
                          <div>
                            <div>Эмийн тун {el.tbltSize}</div>
                            <div className="flex gap-2">
                              <div>Өдөрт {el.dailyTimes} удаа</div>
                              <div>{el.totalDays} хоног</div>
                            </div>
                            <div>Эмийн тоо: {el.tbltSize}</div>
                          </div>
                        </div>
                        <div className="flex w-full flex-wrap gap-11">
                          {baraaGaralt?.jagsaalt?.map((baraa) => {
                            return el?.packGroupeerOldsonBaraanuud?.map(
                              (element) => {
                                return baraa.barCode === element.tbltBarCode ? (
                                  <Checkbox
                                    key={element.tbltBarCode}
                                    onChange={() => {
                                      emdKhunglultuusEmOruulakh({
                                        ...baraa,
                                        zarsanNiitUne: baraa.niitUne,
                                        shirkheg: 0,
                                        khunglukhEsekh: true,
                                        hungulsunDunTsahimJor:
                                          element.tbltUnitDisAmt,
                                        emiinShirkhegiinKhunglukhDun:
                                          element.tbltUnitDisAmt,
                                        tsahimJorUne: element.tbltUnitPrice,
                                        detailId: el?.id,
                                        tbltId: element.id,
                                        packGroup: element.packGroup,
                                        productName:
                                          element.tbltNameSales +
                                          element.tbltSizeMixture,
                                        barCode: element.tbltBarCode,
                                      });
                                    }}
                                    checked={shineSongogdsomEmnuud?.some(
                                      (obj) =>
                                        obj.barCode === element.tbltBarCode
                                    )}
                                    className="flex w-[110px] items-baseline align-baseline">
                                    <div className="text-xs">
                                      {element.tbltNameMon}
                                    </div>
                                    <div className="text-xs">
                                      {element.tbltBarCode}
                                    </div>
                                    <div className="text-xs">
                                      {formatNumber(element.tbltUnitDisAmt, 2)}₮
                                    </div>
                                  </Checkbox>
                                ) : null;
                              }
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col flex-wrap justify-between break-all">
            <div className="text-center font-semibold">Онош</div>
            <div>
              {hynaltiinDugaaraarLavlagaaAvakhData?.receiptDiag
                .split("\n")
                .map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
            </div>
          </div>
        </div> */}
      </Modal>
    </>
  );
}
export default TsahimJorModal;
