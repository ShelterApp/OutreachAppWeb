import React, {
  forwardRef,

} from 'react'
import Link from 'next/link'
import styles from './Component.module.scss'

export interface TextInputProps   {
  style?: object;
  text?: string;
  placeholder?:string;
  type?: string;
  register?: any;
  defaultValue?: string;
  value?: string;
  label?: string;
}
const TextInput: React.FC<TextInputProps> = forwardRef((props, _TextInputRef) => {
  return (
    <div className={styles.container}>
      {
        props.label && <label className={styles.label}>{props.label}</label>
      }
      <input type={props.type || 'text'} defaultValue={props.defaultValue} value={props.value} className={styles.input} placeholder={props.placeholder} {...props.register} autoComplete='off'/ >
    </div>
  )
})

export default TextInput;
