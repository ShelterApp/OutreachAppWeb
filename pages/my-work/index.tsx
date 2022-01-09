/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "styles/Home.module.scss";
import { userService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import dayjs from 'dayjs';

const MyWork: NextPage = () => {
  const [camp, setCamp] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await userService.getLog();
      if (res.results) {
        setCamp(res.results)
      }
    }

    fetch();
  }, []);

  const typeEvent = (item:any) => {
    if(item.action=='JoinEvent') return 'Attended ' + item.info?.title + ' on ' + dayjs(item.createdAt).format("MM/DD/YY") + ' from ' + dayjs(item.info.startDate).format("h:mm A") + ' to ' + dayjs(item.info.endDate).format("h:mm A");
    else if(item.action == 'DropSupplies') return 'Supplied' +item.items.map((a: any) => ` ${a.name}`) +' for '+ (item.type=='Camp'?'camp request':'user request') + ' on ' + dayjs(item.createdAt).format("MM/DD/YY");
  }

  const renderMess = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return camp.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%',  }}>
          { item.action !='RequestSupplies'&& 
          <div style={{ fontSize: 18, fontStyle: 'inherit', padding: 7 }}>
           {typeEvent(item)}
           </div>}
        
      </div>)
  };

  return (
    <main className={styles.mainTop}>
      <Header title='My work' back='/' />
      <Container maxWidth="sm">
        {renderMess()}
      </Container>
    </main>
  );
};

export default MyWork;
