import React from "react";
import Link from "next/link";
import style from "./Component.module.scss";

export interface ButtonProps {
  title?: string;
  search?:boolean;
  onClick?: Function;
}

const Header = ({title}: ButtonProps) => {

  return (
   <div style={{display:'flex',width:'100%',fontSize:18, backgroundColor:'#5952ff',color:'white'}}>
     <div style={{width:'10%'}}>
       Back
     </div>
     <div className={style.titleHeader} style={{width:'80%',textAlign:'center'}}>
     {title}
     </div>
     <div style={{width:'10%'}}>
     Search
     </div>
   </div>
  )
}
export default Header;
