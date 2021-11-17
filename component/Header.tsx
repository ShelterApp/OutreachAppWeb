import React from "react";
import Link from "next/link";
import style from "./Component.module.scss";
import styles from "styles/Home.module.scss";
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
export interface ButtonProps {
  title?: string;
  search?: boolean;
  onClick?: Function;
}

const Header = ({ title }: ButtonProps) => {

  return (
    <div className={style.containerHeader}>
      <div className={style.center}>
        Back
     </div>
      <div className={style.titleHeader} style={{ width: '80%', textAlign: 'center', color: 'white' }}>
        {title}
      </div>
      <div className={style.center}>
        Search
     </div>
    </div>
  )
}
export default Header;
