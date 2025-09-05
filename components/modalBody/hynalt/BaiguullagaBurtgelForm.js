import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, Divider, Form, Input } from "antd";
import moment, { utc } from "moment";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import dynamic from "next/dynamic";

const TextField = dynamic(() => import("@mui/material/TextField"), {
  loading: () => "Loading...",
  ssr: false,
});
const { TextArea } = Input;

const dolooKhonog = [
  { id: "1", ner: "Даваа" },
  { id: "2", ner: "Мягмар" },
  { id: "3", ner: "Лхагва" },
  { id: "4", ner: "Пүрэв" },
  { id: "5", ner: "Баасан" },
  { id: "6", ner: "Бямба" },
  { id: "0", ner: "Ням" },
];

const BaiguullagaBurtgelForm = forwardRef(({ ugugdul, readonly }, ref) => {
  const [form] = Form.useForm();
  const [ajliinUdur, setAjliinUdur] = useState(
    ugugdul?.ajillakhUdruud?.[0]?.udruud || []
  );
  const [amraltiinUdur, setAmraltiinUdur] = useState(
    ugugdul?.ajillakhUdruud?.[1]?.udruud || []
  );
  const [ajliinUdurTsag, setAjliinUdurTsag] = React.useState({
    ekhlekhStag:
      ugugdul?.ajillakhUdruud?.length > 0
        ? utc(`2023-01-01T${ugugdul?.ajillakhUdruud?.[0]?.neekhTsag}:00.000Z`)
        : utc("2023-01-01T09:00:00.000Z"),
    duusakhTsag:
      ugugdul?.ajillakhUdruud?.length > 0
        ? utc(`2023-01-01T${ugugdul?.ajillakhUdruud?.[0]?.khaakhTsag}:00.000Z`)
        : utc("2023-01-01T18:00:00.000Z"),
  });
  const [amraltiinUdurTsag, setAmraltiinUdurTsag] = React.useState({
    ekhlekhStag:
      ugugdul?.ajillakhUdruud?.length > 1
        ? utc(`2023-01-01T${ugugdul?.ajillakhUdruud?.[1].neekhTsag}:00.000Z`)
        : utc("2023-01-01T09:00:00.000Z"),
    duusakhTsag:
      ugugdul?.ajillakhUdruud?.length > 1
        ? utc(`2023-01-01T${ugugdul?.ajillakhUdruud?.[1].khaakhTsag}:00.000Z`)
        : utc("2023-01-01T18:00:00.000Z"),
  });

  useImperativeHandle(
    ref,
    () => ({
      ugugdulShalgakh() {
        const data = form.getFieldsValue();
        const shalgakhTsag = {
          ekhlekhStag: moment("2023-01-01T01:00:00.000Z"),
          duusakhTsag: moment("2023-01-01T10:00:00.000Z"),
        };
        var khariu = "false";
        if (
          data.ner !== ugugdul?.ner ||
          data.khayag !== ugugdul?.khayag ||
          data.utas !== ugugdul?.utas ||
          JSON.stringify(amraltiinUdur) !==
            JSON.stringify(ugugdul?.amraltiinUdur) ||
          JSON.stringify(ajliinUdur) !== JSON.stringify(ugugdul?.ajliinUdur)
        ) {
          khariu = "true";
        } else if (
          (ugugdul?.ajliinUdurTsag === undefined
            ? JSON.stringify(ajliinUdurTsag) !== JSON.stringify(shalgakhTsag)
            : JSON.stringify(ajliinUdurTsag.ekhlekhStag) !==
                JSON.stringify(ugugdul?.ajliinUdurTsag[0]) ||
              JSON.stringify(ajliinUdurTsag.duusakhTsag) !==
                JSON.stringify(ugugdul?.ajliinUdurTsag[1])) ||
          (ugugdul?.amraltiinUdurTsag === undefined
            ? JSON.stringify(amraltiinUdurTsag) !== JSON.stringify(shalgakhTsag)
            : JSON.stringify(amraltiinUdurTsag.ekhlekhStag) !==
                JSON.stringify(ugugdul?.amraltiinUdurTsag[0]) ||
              JSON.stringify(amraltiinUdurTsag.duusakhTsag) !==
                JSON.stringify(ugugdul?.amraltiinUdurTsag[1]))
        ) {
          khariu = "true";
        } else khariu = "false";
        return khariu;
      },
      burtgelAvya() {
        form.submit();
        let { ner, khayag, utas, ajliinUdur, amraltiinUdur } =
          form.getFieldsValue();
        if (
          !ner ||
          !khayag ||
          !utas ||
          ajliinUdur.length < 1 ||
          !ajliinUdurTsag ||
          (amraltiinUdur.length > 0 && !amraltiinUdurTsag)
        )
          return false;
        else {
          return {
            ner,
            khayag,
            utas,
            ajillakhUdruud: [
              {
                neekhTsag: moment(ajliinUdurTsag?.ekhlekhStag).format("HH:mm"),
                khaakhTsag: moment(ajliinUdurTsag?.duusakhTsag).format("HH:mm"),
                udruud: ajliinUdur,
              },
              {
                neekhTsag: moment(amraltiinUdurTsag?.ekhlekhStag).format(
                  "HH:mm"
                ),
                khaakhTsag: moment(amraltiinUdurTsag?.duusakhTsag).format(
                  "HH:mm"
                ),
                udruud: amraltiinUdur,
              },
            ],
          };
        }
      },
    }),
    [form, amraltiinUdurTsag, ajliinUdur, amraltiinUdur, ajliinUdurTsag]
  );
  useEffect(() => {
    form.setFieldValue("ajliinUdur", ajliinUdur);
    form.setFieldValue("amraltiinUdur", amraltiinUdur);
  }, [ajliinUdur, amraltiinUdur]);

  return (
    <Form
      form={form}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 22 }}
      initialValues={ugugdul}
      layout="horizontal"
      size="small"
    >
      <Form.Item
        label="Нэр"
        name="ner"
        requiredMark="optional"
        rules={[{ required: true, message: "Нэр заавал оруулна уу!" }]}
      >
        <Input
          disabled={readonly}
          autoComplete="off"
          style={{
            height: "32px",
            width: "60%",
            borderColor: "#4FD1C5",
            borderRadius: "25px",
            borderWidth: 1,
          }}
        />
      </Form.Item>
      <Form.Item
        label="Хаяг"
        name="khayag"
        requiredMark="optional"
        rules={[{ required: true, message: "Хаяг заавал оруулна уу!" }]}
      >
        <TextArea
          disabled={readonly}
          style={{
            width: "60%",
            borderColor: "#4FD1C5",
            borderRadius: "25px",
            borderWidth: 1,
          }}
        />
      </Form.Item>
      <Form.Item
        label="Утас"
        name="utas"
        requiredMark="optional"
        rules={[{ required: true, message: "Утас заавал оруулна уу!" }]}
      >
        <Input
          autoComplete="off"
          disabled={readonly}
          type={"tel"}
          style={{
            height: "32px",
            width: "60%",
            borderColor: "#4FD1C5",
            borderRadius: "25px",
            borderWidth: 1,
          }}
        />
      </Form.Item>
      <Divider orientation="center">
        <span className="text-gray-800 dark:text-gray-200">Ажлын өдөр</span>
      </Divider>

      <Form.Item
        label="Өдөр"
        name="ajliinUdur"
        requiredMark="optional"
        rules={[{ required: true, message: "Ажлын өдөр заавал сонгоно уу!" }]}
      >
        <div className="grid grid-cols-7 gap-[3px] sm:gap-2">
          {dolooKhonog.map((a, i) => {
            return (
              <Button
                className={`w-full rounded-md border shadow-md  ${
                  ajliinUdur?.find((c) => c === a.id) !== undefined &&
                  "!bg-blue-800 !text-white"
                }`}
                key={i}
                onClick={() => {
                  !readonly &&
                    (ajliinUdur.find((c) => c === a.id) === undefined
                      ? setAjliinUdur([...ajliinUdur, a.id])
                      : setAjliinUdur(ajliinUdur.filter((d) => d !== a.id)));
                  !readonly &&
                    setAmraltiinUdur(amraltiinUdur.filter((b) => b !== a.id));
                }}
              >
                {a.ner}
              </Button>
            );
          })}
        </div>
      </Form.Item>
      <Form.Item label={<div className="dark:text-gray-200">Цаг</div>}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <div className="flex gap-10 dark:text-gray-200">
            <MobileTimePicker
              ampm={false}
              disabled={readonly}
              label={<div className="dark:text-gray-200">Нээх цаг</div>}
              value={ajliinUdurTsag.duusakhTsag}
              onChange={(newValue) => {
                setAjliinUdurTsag({ ...ajliinUdurTsag, duusakhTsag: newValue });
              }}
              slotProps={{
                textField: {
                  className: "dark:text-gray-200",
                  InputProps: {
                    sx: (theme) => ({
                      font: "inherit",
                      letterSpacing: "inherit",
                      color:
                        theme.palette.mode === "dark"
                          ? "#777"
                          : "#777",
                      padding: "16.5px 14px 5px",
                      height: "3.5rem",
                      width: "100%",
                      boxSizing: "border-box",
                      background: "none",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4FD1C5",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#38B2AC",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#319795",
                      },
                    }),
                  },
                },
              }}
            />

            <MobileTimePicker
              ampm={false}
              disabled={readonly}
              label={<div className="dark:text-gray-200">Хаах цаг</div>}
              value={ajliinUdurTsag.duusakhTsag}
              onChange={(newValue) => {
                setAjliinUdurTsag({ ...ajliinUdurTsag, duusakhTsag: newValue });
              }}
              slotProps={{
                textField: {
                  className: "dark:text-gray-200",
                  InputProps: {
                    sx: (theme) => ({
                      font: "inherit",
                      letterSpacing: "inherit",
                      color:
                        theme.palette.mode === "dark"
                          ? "#777"  
                          : "#777", 
                      padding: "16.5px 14px 5px",
                      height: "3.5rem",
                      width: "100%",
                      boxSizing: "border-box",
                      background: "none",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4FD1C5",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#38B2AC",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#319795",
                      },
                    }),
                  },
                },
              }}
            />
          </div>
        </LocalizationProvider>
      </Form.Item>
      <Divider orientation="center">
        <span className="text-gray-800 dark:text-gray-200">Амралтын өдөр</span>
      </Divider>
      <Form.Item
        label={<div className="dark:text-gray-200">Өдөр</div>}
        name="amraltiinUdur"
      >
        <div className="grid grid-cols-7 gap-[3px] dark:text-gray-200 sm:gap-2">
          {dolooKhonog.map((a, i) => {
            return (
              <Button
                className={`w-full rounded-md border shadow-md  ${
                  amraltiinUdur?.find((c) => c === a.id) !== undefined &&
                  "!bg-green-500 !text-white dark:text-gray-200"
                }`}
                key={i}
                onClick={() => {
                  !readonly &&
                    (amraltiinUdur.find((c) => c === a.id) === undefined
                      ? setAmraltiinUdur([...amraltiinUdur, a.id])
                      : setAmraltiinUdur(
                          amraltiinUdur.filter((d) => d !== a.id)
                        ));
                  !readonly &&
                    setAjliinUdur(ajliinUdur.filter((b) => b !== a.id));
                }}
              >
                {a.ner}
              </Button>
            );
          })}
        </div>
      </Form.Item>
      <Form.Item label={<div className="dark:text-gray-200">Цаг</div>}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <div className="flex gap-10">
            <MobileTimePicker
              ampm={false}
              disabled={readonly}
              label={<div className="dark:text-gray-200">Нээх цаг</div>}
              value={ajliinUdurTsag.duusakhTsag}
              onChange={(newValue) => {
                setAjliinUdurTsag({ ...ajliinUdurTsag, duusakhTsag: newValue });
              }}
              slotProps={{
                textField: {
                  className: "dark:text-gray-200",
                  InputProps: {
                    sx: (theme) => ({
                      font: "inherit",
                      letterSpacing: "inherit",
                      color:
                        theme.palette.mode === "dark"
                          ? "#777"
                          : "#777",
                      padding: "16.5px 14px 5px",
                      height: "3.5rem",
                      width: "100%",
                      boxSizing: "border-box",
                      background: "none",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4FD1C5",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#38B2AC",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#319795",
                      },
                    }),
                  },
                },
              }}
            />

            <MobileTimePicker
              ampm={false}
              disabled={readonly}
              label={<div className="dark:text-gray-200">Хаах цаг</div>}
              value={ajliinUdurTsag.duusakhTsag}
              onChange={(newValue) => {
                setAjliinUdurTsag({ ...ajliinUdurTsag, duusakhTsag: newValue });
              }}
              slotProps={{
                textField: {
                  className: "dark:text-gray-200",
                  InputProps: {
                    sx: (theme) => ({
                      font: "inherit",
                      letterSpacing: "inherit",
                      color:
                        theme.palette.mode === "dark"
                          ? "#777"
                          : "#777",
                      padding: "16.5px 14px 5px",
                      height: "3.5rem",
                      width: "100%",
                      boxSizing: "border-box",
                      background: "none",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4FD1C5",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#38B2AC",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#319795",
                      },
                    }),
                  },
                },
              }}
            />
          </div>
        </LocalizationProvider>
      </Form.Item>
    </Form>
  );
});

export default BaiguullagaBurtgelForm;
