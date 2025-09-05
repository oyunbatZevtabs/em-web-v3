import { Button as ButtonAntd } from "antd";

export const Button = ({ size, className, type, ...props }) => (
  <ButtonAntd size={size} className={className} type={type} {...props} />
);
