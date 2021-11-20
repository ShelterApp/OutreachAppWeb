import React, { forwardRef, SelectHTMLAttributes } from "react";
import styles from "./Component.module.scss";
import Select from "react-select";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  style?: object;
  text?: string;
  placeholder?: string;
  options?: any;
  onChange?: (e: any) => void;
  value?: any;
  label?: string;
}
// eslint-disable-next-line react/display-name
const SelectInput: React.FC<SelectProps> = forwardRef((props, _SelectRef) => {
  return (
    <div className={styles.selectContainer}>
      <Select
        onChange={props.onChange}
        styles={customStyles}
        placeholder={props.placeholder}
        options={props?.options}
        value={props.value}
      />
    </div>
  );
});

export default SelectInput;
const customStyles = {
  placeholder: (provided: any) => ({
    ...provided,
    width: "100%",
    color: "gray",
    fontSize: 14,
    paddingLeft: 0,
  }),
  control: (provided: any) => ({
    ...provided,
    color: "black",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    marginBottom: 10,
    width: '100%'
  }),
  menu: (provided: any) => ({
    ...provided,
    width: "100%",
    color: "black",
  }),
};
