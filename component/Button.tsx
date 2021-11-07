import React, {
  forwardRef,
  ButtonHTMLAttributes,
} from 'react'
import Link from 'next/link'
import style from './Component.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  link?: string
  text?: string
}
const Button: React.FC<ButtonProps> = forwardRef((props, _buttonRef) => {
  return (
    <Link href={props.link|| '#'}>
    <div  className={style.card}>
      <h2>{props.text}</h2>
    </div> 
    </Link>
  )
})

export default Button
