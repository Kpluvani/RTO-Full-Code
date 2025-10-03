import React from "react";
import { Input } from "antd";

const { TextArea } = Input;

const CapitalizedTextArea = ({ value, onChange, ...props }) => {
  const transformValue = (val) => {
    const str = val == null ? "" : String(val);
    return str.replace(/[a-z]/g, (char) => char.toUpperCase());
  };

  const handleChange = (e) => {
    const capitalizedValue = transformValue(e.target.value);
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: capitalizedValue,
        },
      });
    }
  };

  return (
    <TextArea
      {...props}
      value={transformValue(value)}
      onChange={handleChange}
    />
  );
};

export default CapitalizedTextArea;
