/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, {
  forwardRef,

} from 'react'
import styles from './Component.module.scss'
import InputPassword from "./InputPassword";
export interface TextInputProps   {
  style?: object;
  text?: string;
  placeholder?:string;
  type?: string;
  register?: any;
  defaultValue?: string;
  value?: string;
  label?: string;
  onChange?:Function;
}
const TextInput: React.FC<TextInputProps> = forwardRef((props) => {
  return (
    <div className={styles.container}>
      {
        props.label && <label className={styles.label}>{props.label}</label>
      }
      {
        props.type === "password" ? (
          <InputPassword placeholder={props.placeholder} register={props.register}/>
        ) : (
          <>
            <input type={props.type || 'text'} defaultValue={props.defaultValue} 
            onChange={props.onChange}
            value={props.value} className={styles.input} placeholder={props.placeholder} {...props.register} autoComplete="off" autoFill='off'/>
          </>
        )
      }
    </div>
  )
})

export default TextInput;
