import React from "react";
import { Input as InputAnt, InputNumber as InputNumberAntd } from "antd";
const { TextArea: AntTextArea } = InputAnt;

export const Input = ({
  size,
  className,
  fontWeight = "regular",
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  color = "#4FD1C5",
  ...props
}) => (
  <InputAnt autoComplete="off" className={className} style={style} {...props} />
);

export const InputPassword = ({
  size,
  className,
  fontWeight = "regular",
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  color = "#4FD1C5",
  ...props
}) => <InputAnt.Password className={className} style={style} {...props} />;

export const InputNumber = ({
  size,
  className,
  fontWeight = "regular",
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  color = "#4FD1C5",
  ...props
}) => <InputNumberAntd className={className} style={style} {...props} />;

export const TextArea = ({
  size,
  className,
  fontWeight = "regular",
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  color = "#4FD1C5",
  ...props
}) => <AntTextArea className={className} style={style} {...props} />;
