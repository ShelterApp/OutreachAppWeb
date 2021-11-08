import React, {
  forwardRef,
  
} from 'react'
import Link from 'next/link'
import styles from './Component.module.css'

export interface TextInputProps   {
  style?: object;
  text?: string;
  placeholder?:string;
  type?: string;
  register?: any;
}
const TextInput: React.FC<TextInputProps> = forwardRef((props, _TextInputRef) => {
  return (
    <div className={styles.container}>
      <input type={props.type || 'text'} className={styles.input} placeholder={props.placeholder} {...props.register}/>
    </div>
  )
})

export default TextInput
