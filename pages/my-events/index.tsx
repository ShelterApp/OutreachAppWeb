import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { eventsService, alertService } from "services";
import Header from "component/Header";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

const Index: NextPage = () => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await eventsService.list();
      if (res && res.items) {
        setList(res.items);
      }
    };
    fetchData();
  }, []);

  const unjoin = async (id: string) => {
    const res = await eventsService.unjoin(id);
    if (res && res.statusCode === 400) {
      alertService.error(res.message)
    } else {
      const new_list = list.filter((org) => org._id !== id);
      setList(new_list);
      alertService.success("Unjoin this event successful");
    }
  }
  return (
    <div className={styles.mainTop}>
      <Header title="My Events" back="/" />
      {
        list.map((obj: any, index: number) => (
          <div key={index} style={{width: '100%'}}>
            <div style={{padding: 10}}>
              <h3 className="mt-0">{obj.title}</h3>
              <p>Distribution: {dayjs(obj.startDate).format("MMMM DD, YYYY")} from {dayjs(obj.startDate).format("hh:mm A")} - {dayjs(obj.endDate).format("hh:mm A")}</p>
              <p>{obj.countAttended} members attending out of {obj.maxAttended}</p>
              <div style={{textAlign: 'center'}}>
                <Button style={{ textTransform: 'none', fontSize: 16, maxWidth: '350px', width: '100%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained" onClick={() => unjoin(obj._id)}>
                  {"Can't Go"}
                </Button>
              </div>
            </div>
            <hr/>
          </div>
        ))
      }
    </div>
  );
};

export default Index;
