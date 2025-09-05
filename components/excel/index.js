import {
  Button,
  message,
  Switch,
  Upload,
  Empty,
  Space,
  Form,
  Select,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import posUilchilgee, { posUrl } from "services/posUilchilgee";
import downloadFileWithToken from "tools/function/downloadFileWithToken";
import Table from "components/ant/AntdTable";
import { useAuth } from "services/auth";
import AldaaAlert from "components/alert/AldaaAlert";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

function beforeUpload(file, callback) {
  const isJpgOrPng =
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isJpgOrPng) {
    AnkhaaruulgaAlert("Та зөвхөн xlsx өргөтгөлтэй EXCEL оруулна уу");
  }

  callback(file);
  return false;
}
const order = { createdAt: -1 };

const searchKeys = ["ner", "ovog", "utas", "mail", "register"];
function Excel({
  token,
  convertData,
  columns,
  setFile,
  file,
  tatakhZam,
  setKhariltsagchiinId,
  khariltsagchiinId,
  setSelectedMurNer,
  selectedMurNer,
  fileiinNer,
}) {
  const [ugugdulKharuulakhEsekh, setUgugdulKharuulakhEsekh] = useState(false);
  const [jagsaalt, setJagsaalt] = useState(null);
  const { baiguullagiinId } = useAuth();

  const [aldaa, setAldaa] = useState(null);
  useEffect(() => {
    if (file === null) {
      setUgugdulKharuulakhEsekh(false);
      setJagsaalt(null);
      setAldaa(null);
    }
  }, [file]);

  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
      turul: "Нийлүүлэгч",
    }),
    [baiguullagiinId]
  );

  const { data, setKhuudaslalt, onSearch } = posUseJagsaalt(
    "/khariltsagch",
    query,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined
  );

  function onSwitch(checked) {
    setUgugdulKharuulakhEsekh(checked);
    if (checked === true && !!file) convertData(file, setJagsaalt);
  }

  return (
    <div>
      <div className="flex w-full justify-between ">
        <Upload
          name="avatar"
          multiple={false}
          showUploadList={false}
          beforeUpload={(f) =>
            beforeUpload(f, (file) => {
              setFile(file);
              if (ugugdulKharuulakhEsekh === true && !!file)
                convertData(file, setJagsaalt);
            })
          }
        >
          <Button type="primary">Excel оруулах</Button>
        </Upload>
        <Switch
          checkedChildren={<EyeOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
          checked={ugugdulKharuulakhEsekh}
          onChange={onSwitch}
        />
      </div>
      {!!file && (
        <div className="flex flex-row items-center space-x-2">
          <div>
            <FileExcelOutlined />
          </div>
          <div>{file?.name}</div>
          <div
            className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-gray-200"
            onClick={() => setFile(null)}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </div>
        </div>
      )}
      {!file ||
      tatakhZam === "/aguulkhiinZagvarAvya" ||
      tatakhZam === "/khariltsagchZagvarAvya" ||
      tatakhZam === "/dansniiZagvarAvya" ? (
        !ugugdulKharuulakhEsekh ? (
          <div>
            <Empty
              description={
                <a
                  onClick={() =>
                    tatakhZam === "/aguulkhiinZagvarAvya"
                      ? posUilchilgee(token)
                          .get("/BaraaniiAngilal", {
                            params: {
                              baiguullagiinId: baiguullagiinId,
                            },
                          })
                          .then(({ data }) => {
                            if (!!data && data?.jagsaalt?.length > 0) {
                              downloadFileWithToken(
                                posUrl + tatakhZam,
                                token,
                                fileiinNer,
                                baiguullagiinId
                              );
                            } else AldaaAlert("Барааны ангилал бүртгэнэ үү!");
                          })
                      : downloadFileWithToken(
                          posUrl + tatakhZam,
                          token,
                          fileiinNer
                        )
                  }
                >
                  Загвар татах
                </a>
              }
            />
          </div>
        ) : null
      ) : (
        <div className="flex h-40 w-full items-center justify-center">
          <Form.Item
            className="w-1/2"
            autoComplete={false}
            label="Нийлүүлэгч"
            name="khariltsagchiinId"
            rules={[
              {
                required: true,
                message: "Нийлүүлэгч сонгоно уу!",
              },
            ]}
          >
            <Select
              bordered={false}
              value={khariltsagchiinId}
              onChange={(v) => {
                setKhariltsagchiinId(v);
                const selectedMur = data?.jagsaalt.find((mur) => mur._id === v);

                if (selectedMur) {
                  setSelectedMurNer(selectedMur.ner);
                }
              }}
              placeholder="Нийлүүлэгч сонгох"
              className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
              showSearch
              filterOption={(o) => o}
              allowClear={true}
              onSearch={(v) =>
                setKhuudaslalt((e) => ({
                  ...e,
                  khuudasniiDugaar: 1,
                  search: v,
                }))
              }
            >
              {data?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur._id}>
                    <div className={`flex justify-start `}>
                      <div className="font-bold">{mur.ner}</div>
                      {"---"}
                      {mur.register}
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
      )}
      {aldaa && (
        <div
          className="max-h-52 overflow-auto text-red-600"
          dangerouslySetInnerHTML={{
            __html: aldaa,
          }}
        />
      )}
      {!!ugugdulKharuulakhEsekh && !!jagsaalt && (
        <Table
          locale={{ emptyText: "Өгөгдөлгүй байна" }}
          scroll={{ y: "calc(100vh - 25rem)", x: "calc(20vw - 25rem)" }}
          tableLayout={jagsaalt?.length > 0 ? "auto" : "fixed"}
          rowKey={(row) => row.id}
          columns={columns}
          dataSource={jagsaalt}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 100,
          }}
        />
      )}
    </div>
  );
}

export default React.forwardRef(Excel);
