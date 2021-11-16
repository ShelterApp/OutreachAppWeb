import React from "react";
import Link from "next/link";
import style from "./Component.module.scss";
import Button from '@mui/material/Button';
import Image from 'next/image'
import LoadingButton from '@mui/lab/LoadingButton';
export interface ButtonProps {
  link?: string;
  text: string;
  type?:string;
  onClick?: Function;
  loading?: Boolean | false;
}

const ButtonComp = ({link, text, onClick, type, loading}: ButtonProps) => {

  const clickButton = () => {
    if(typeof onClick != 'function') return;
    onClick()
  }

  return (
    <>
      {
        loading ? (
          <LoadingButton className={style.card} loading>
            Submit
          </LoadingButton>
        ) :
        <>
          {
            link ?
            <Link href={link} passHref>
              <Button style={{textTransform:'none'}} variant="contained" className={style.card} onClick={clickButton} >
                {text}
              </Button>
            </Link> :
            <Button style={{textTransform:'none'}} variant="contained" className={style.card} onClick={clickButton} type='submit'>
              {text}
            </Button>
          }
        </>
      }
    </>
  )
}

export default ButtonComp;
