import React, {
  forwardRef,
  SelectHTMLAttributes,
} from 'react'
import Link from 'next/link'
import styles from './Component.module.css'
import Select  from "react-select";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  style?: object
  text?: string
  placeholder?:string
}
const SelectInput: React.FC<SelectProps> = forwardRef((props, _SelectRef) => {
  return (
    <div className={styles.selectContainer}>
    <Select
        id="long-value-select"
        instanceId="long-value-select"
        onChange={props.onChange}
        styles={customStyles}
        placeholder={props.placeholder}
        options={props.options}
    />
</div>
  )
})

export default SelectInput
const customStyles = {
  placeholder: (provided: any) => ({
      ...provided,
      width: "100%",
      color: "grey",
      fontSize: 19,
      paddingLeft: 4,
  }),
  control: (provided: any) => ({
      ...provided,
      color: "black",
      borderColor: "grey",
      borderWidth: 2,
      borderRadius: 9,
      height: 40,
  }),
  menu: (provided: any) => ({
      ...provided,
      width: "100%",
      color: "black",
  }),
};
