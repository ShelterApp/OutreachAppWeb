import React, {
  forwardRef,
  TextInputHTMLAttributes,
} from 'react'
import Link from 'next/link'
import styles from './Component.module.css'

export interface TextInputProps extends TextInputHTMLAttributes<HTMLTextInputElement> {
  style?: object
  text?: string
  placeholder?:string
}
const TextInput: React.FC<TextInputProps> = forwardRef((props, _TextInputRef) => {
  return (
    <div className={styles.container}>
    <input className={styles.input} type='text' placeholder={props.placeholder}/>
    </div>
  )
})

export default TextInput
