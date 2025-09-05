import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Form,
  InputNumber,
  Select,
  Input,
  notification,
  Switch,
  Modal,
} from "antd";
import compareFields from "tools/function/compareFields";
import useDans from "hooks/useDans";
import posUpdateMethod from "tools/function/crud/posUpdateMethod";
import posCreateMethod from "tools/function/crud/posCreateMethod";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

function DansBurtgel(
  { data, destroy, baiguullagiinId, salbariinId, token, dansMutate },
  ref
) {
  const query = useMemo(() => {
    var query = {};
    if (baiguullagiinId) query.baiguullagiinId = baiguullagiinId;
    return query;
  }, [baiguullagiinId]);

  const [form] = Form.useForm();
  const [bank, setBank] = useState(data?.bank);
  const { dansGaralt } = useDans(token, query);

  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["bank", "dugaar", "dansniiNer", "valyut"]))
      Modal.confirm({
        content: "Та хадгалахгүй гарахдаа итгэлтэй байна уу?",
        okText: "Тийм",
        cancelText: "Үгүй",
        onOk: destroy,
      });
    else destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("bank").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const ugugdul = form.getFieldsValue();

        const method = ugugdul?._id ? posUpdateMethod : posCreateMethod;
        ugugdul["barilgiinId"] = salbariinId;
        ugugdul["baiguullagiinId"] = baiguullagiinId;
        var dansDavkhatssanEsekh = false;
        if (dansGaralt?.jagsaalt && dansGaralt?.jagsaalt?.length > 0) {
          for (const a of dansGaralt.jagsaalt) {
            if (ugugdul.dugaar == a.dugaar) {
              dansDavkhatssanEsekh = true;
            }
          }
        }
        if (!dansDavkhatssanEsekh) {
          method("Dans", token, { ...data, ...ugugdul }).then(({ data }) => {
            if (data === "Amjilttai") {
              AmjilttaiAlert("Амжилттай хадгаллаа");
              dansMutate();
              destroy();
            }
          });
        } else {
          AnkhaaruulgaAlert("Данс давхардсан байна");
        }
      },
      khaaya() {
        garya();
      },
    }),
    [form]
  );

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "bank":
          form.getFieldInstance("dugaar").focus();
          form.getFieldInstance("dugaar").select();
          break;
        case "dugaar":
          form.getFieldInstance("dansniiNer").focus();
          form.getFieldInstance("dansniiNer").select();
          break;
        case "dansniiNer":
          form.getFieldInstance("valyut").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 10 }}
      autoComplete={"off"}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item hidden name="_id"></Form.Item>
      <Form.Item label={"Банкны нэр"} name="bank">
        <Select
          className="rounded-lg border"
          onSelect={setBank}
          onKeyUp={focuser}
        >
          <Select.Option key="khanbank" value="khanbank">
            {"Хаан банк"}
          </Select.Option>
          <Select.Option key="tdb" value="tdb">
            {"Худалдаа хөгжлийн банк"}
          </Select.Option>
          <Select.Option key="golomt" value="golomt">
            {"Голомт банк"}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label={"Дансны дугаар"} name="dugaar">
        <InputNumber style={{ width: "100%" }} min={0} onKeyUp={focuser} />
      </Form.Item>
      <Form.Item label={"Дансны нэр"} name="dansniiNer">
        <Input onKeyUp={focuser} />
      </Form.Item>
      <Form.Item label={"Валют"} name="valyut">
        <Select className="rounded-lg border" onKeyUp={focuser}>
          <Select.Option key="MNT" value="MNT">
            MNT
          </Select.Option>
          <Select.Option key="USD" value="USD">
            USD
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(DansBurtgel);
