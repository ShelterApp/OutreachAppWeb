import type { NextPage } from "next";
import React, { useEffect,  useState} from "react";
 import { useRouter } from "next/router";
import styles from "styles/Home.module.scss";
 import {  userService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import dayjs from 'dayjs';

const MyWork: NextPage = () => {
  const router = useRouter();
  const [camp, setCamp] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await userService.getLog();
      if (res.results){
        setCamp(res.results)
      } 
    }

    fetch();
  }, []);

  const renderMess = () => {
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return camp.map((item:any, index:number) =>
      <div key={index} style={{ width: '100%', paddingTop: 5,display:'flex',flexDirection:'row',justifyContent:'space-between' }}>
        <div style={{ fontSize: 18, fontStyle: 'inherit',  paddingBottom: 10 }}> 
        {item.userId.name} {item.action=='DropSupplies'?'dropped ':'requested '} 
        {item.items.map((a:any,index2:number)=>` ${a.qty} ${a.name} ${index2!=item.items.length-1?',':''}`)}
        </div>
        <div style={{ fontSize: 20, fontStyle: 'inherit', paddingBottom: 10 }}>{dayjs(item.createdAt).format("DD/MM/YYYY")} </div>
      </div>)
  };

  return (
    <main className={styles.mainTop}>
      <Header title='Camp Log' back='/' />
      <Container maxWidth="sm">
        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5,justifyContent:'space-between' }}>
          <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> Message </strong></div>
          <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> Time </strong></div>
        </div>
       {renderMess()}
      </Container>
    </main>
  );
};

export default MyWork;
