import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Empty,
  InputNumber,
  message,
  notification,
  Switch,
  Table,
  Upload,
} from "antd";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";

import { IoIosArrowBack } from "react-icons/io";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import posUilchilgee, { posUrl } from "services/posUilchilgee";
import downloadFileWithToken from "tools/function/downloadFileWithToken";
import { useAuth } from "services/auth";
import BaraaniiAngilal from "./BaraaniiAngilal";
import XLSX from "xlsx";
import usegTooruuKhurvuulekh from "tools/function/usegTooruuKhurvuulekh";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";

function BaraaniiAngilalExcel({ setTsonkh, setAsuukhEsekh }) {
  const [file, setFile] = useState(null);
  const [jagsaalt, setJagsaalt] = useState(null);
  const [aldaa, setAldaa] = useState(null);
  const { token, baiguullagiinId } = useAuth();

  function beforeUpload(file, callback) {
    const isJpgOrPng =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isJpgOrPng) {
      AldaaAlert("Та зөвхөн xlsx өргөтгөлтэй EXCEL оруулна уу");
    }

    callback(file);
    return false;
  }

  useEffect(() => {
    if (file === null) {
      setUgugdulKharuulakhEsekh(false);
      setJagsaalt(null);
      setAldaa(null);
    }
  }, [file]);

  const [ugugdulKharuulakhEsekh, setUgugdulKharuulakhEsekh] = useState(false);
  function onSwitch(checked) {
    setUgugdulKharuulakhEsekh(checked);
    if (checked === true && !!file) convertData(file, setJagsaalt);
  }

  function convertData(file, setJagsaalt) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const worksheet = wb.Sheets[wb.SheetNames[0]];

      const jagsaalt = [];
      var tolgoinObject = {};

      for (let cell in worksheet) {
        const cellAsString = cell?.toString();

        if (cellAsString[1] === "1") {
          if (worksheet[cellAsString].v === "Ангилал")
            tolgoinObject.angilal = usegTooruuKhurvuulekh(cellAsString[0]);
        }
      }

      var data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });

      data.forEach((mur) => {
        let object = {};
        object.angilal = mur[tolgoinObject.angilal];

        if (!!object.angilal) jagsaalt.push(object);
      });
      setJagsaalt(jagsaalt);
    };
    reader.readAsBinaryString(file);
  }

  const columns = useMemo(
    () => [
      {
        title: "Ангилал",
        dataIndex: "angilal",
        key: "angilal",
        ellipsis: true,
        width: "6rem",
        render: (angilal) => {
          return <div className="w-56 truncate">{angilal}</div>;
        },
      },
    ],
    []
  );

  const shiljikhKhuudas = useMemo(() => {
    return [
      {
        tsonkh: (
          <BaraaniiAngilal
            setAsuukhEsekh={setAsuukhEsekh}
            setTsonkh={setTsonkh}
          />
        ),
      },
    ];
  }, []);

  const onFinish = () => {
    if (!!file && !!baiguullagiinId) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("baiguullagiinId", baiguullagiinId);
      posUilchilgee(token)
        .post("/angilaliinZagvarTatya", formData)
        .then(({ data, status }) => {
          if (status === 200 && data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгаллаа");
            setFile(null);
            setAsuukhEsekh(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else AldaaAlert("Excel файл аа сонгоно уу !");
  };

  return (
    <div className="flex w-[100%] min-w-[90%] flex-col gap-4">
      <div className="cursor-pointer">
        <IoIosArrowBack
          size={20}
          onClick={() => setTsonkh(shiljikhKhuudas[0])}
        />
      </div>
      <div>
        <div className="flex w-full justify-between ">
          <Upload
            name="avatar"
            multiple={false}
            showUploadList={false}
            beforeUpload={(f) =>
              beforeUpload(f, (file) => {
                setAsuukhEsekh(true);
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
              onClick={() => {
                setFile(null);
                setAsuukhEsekh(false);
              }}
            >
              <DeleteOutlined style={{ color: "red" }} />
            </div>
          </div>
        )}
        {!jagsaalt && (
          <Empty
            description={
              <a
                onClick={() =>
                  downloadFileWithToken(
                    posUrl + "/angilaliinExcelAvya",
                    token,
                    "Ангилал Excel загвар.xlsx"
                  )
                }
              >
                Загвар татах
              </a>
            }
          />
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
            tableLayout={jagsaalt?.length > 0 ? "auto" : "fixed"}
            scroll={{ y: "calc(100vh - 31rem)" }}
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
      <div className="absolute bottom-5 right-5">
        <Button onClick={onFinish} type="primary">
          Хадгалах
        </Button>
      </div>
    </div>
  );
}

export default BaraaniiAngilalExcel;
