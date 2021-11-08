import React from "react";
import Link from "next/link";
import style from "./Component.module.css";
import Button from '@mui/material/Button';

export interface ButtonProps {
  link?: string;
  text: string;
  onClick?: Function;
}

const ButtonComp = ({link, text, onClick}: ButtonProps) => {
  const clickButton = () => {
    if(typeof onClick != 'function') return;

    onClick()
  }
  return (
    <Link href={link || "#"} passHref>
      <Button variant="contained" className={style.card} onClick={clickButton}>
        {text}
      </Button>
    </Link>
  )
}

export default ButtonComp;
