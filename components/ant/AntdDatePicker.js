import { DatePicker as DatePickerAnt } from "antd";
import moment from "moment";

export const DatePicker = (rest) => <DatePickerAnt {...rest} />;
export const RangePicker = ({ dropdownClassName, value, ...rest }) => {
  return (
    <DatePickerAnt.RangePicker
      value={
        value?.length > 0 ? [moment(value[0]), moment(value[1])] : [null, null]
      }
      dropdownClassName={dropdownClassName}
      {...rest}
    />
  );
};
