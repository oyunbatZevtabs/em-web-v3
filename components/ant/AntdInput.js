import React, { forwardRef } from "react";
import { Input as InputAnt, InputNumber as InputNumberAntd } from "antd";

const { TextArea: AntTextArea } = InputAnt;

export const Input = ({
  size,
  className,
  fontWeight,
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  bg,
  color,
  ...props
}) => (
  <InputAnt
    {...props}
    className={className}
    style={{
      ...style,
    }}
  />
);
export const InputPassword = ({
  size,
  className,
  fontWeight,
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  bg,
  color,
  ...props
}) => (
  <InputAnt.Password {...props} className={className} style={{ ...style }} />
);

export const InputNumber = ({
  className,
  fontWeight,
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  bg,
  color,
  ...props
}) => (
  <InputNumberAntd
    {...props}
    onKeyPress={(event) => {
      if (!/[0-9,.]/.test(event.key)) {
        event.preventDefault();
      } else if (event.key === ",") {
        event.preventDefault();
        const currentValue = event.target.value || "";
        event.target.value = currentValue + ".";
      }
      if (String(event.target.value).length === 1) {
        var last = event.key;
        var first = String(event.target.value).indexOf(0);
        if (last !== "." && first === 0) {
          event.target.value = "";
        }
      }
    }}
    parser={(v) => v.replace(/,/g, "")}
    className={className}
    style={{
      ...style,
    }}
  />
);

export const TextArea = ({
  size,
  className,
  fontWeight,
  style = {
    width: "100%",
    borderColor: "#4FD1C5",
    borderRadius: "25px",
    borderWidth: 1,
  },
  bg,
  color,
  ...props
}) => (
  <AntTextArea
    {...props}
    className={className}
    style={{
      ...style,
    }}
  />
);

const TooShirkhegInput = forwardRef(
  (
    {
      className,
      fontWeight,
      style = {
        width: "100%",
        borderColor: "#4FD1C5",
        borderRadius: "25px",
        borderWidth: 1,
      },
      bg,
      color,
      ...props
    },
    ref
  ) => {
    return (
      <InputNumberAntd
        {...props}
        ref={ref}
        onKeyPress={(event) => {
          if (!/[0-9,.]/.test(event.key)) {
            event.preventDefault();
          } else if (event.key === ",") {
            event.preventDefault();
            const currentValue = event.target.value || "";
            event.target.value = currentValue + ".";
          }
          if (String(event.target.value).length === 1) {
            var last = event.key;
            var first = String(event.target.value).indexOf(0);
            if (last !== "." && first === 0) {
              event.target.value = "";
            }
          }
        }}
        parser={(v) => v.replace(/,/g, "")}
        className={className}
        style={{
          ...style,
        }}
      />
    );
  }
);

export default TooShirkhegInput;
