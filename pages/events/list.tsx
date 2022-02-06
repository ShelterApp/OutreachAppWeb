import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { eventsService, alertService, userService } from "services";
import Header from "component/Header";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faHandsHelping } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Router from "next/router";
import Image from 'next/image';

const Index: NextPage = () => {
  const [list, setList] = useState<any[]>([]);
  const user = userService.userValue.user;
  const containerStyle: any = {
    width: '100%',
    minHeight: 'calc(100vh - 155px)',
    maxWidth: '1024px',
    position: 'relative',
    overflow: 'hidden'
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await eventsService.list();
      if (res && res.items) {
        setList(res.items);
      }
    };
    fetchData();
  }, []);

  const isJoined = (attendes: any[]) => {
    const _user = attendes.find((obj: any) => obj.userId === user._id);
    return !_user;
  }

  const join = async (id: string) => {
    const res = await eventsService.join(id);
    console.log(res)
    if (res && res.statusCode === 400) {
      alertService.error(res.message)
    } else {
      const res = await eventsService.list();
      if (res && res.items) {
        setList(res.items);
        alertService.success("Join this event successful");
      }
    }
  }

  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='OutreachApp' user={user} />
      <div className={styles.grid} style={{ paddingTop: 0, }}>
        <div style={containerStyle}>
          {
            list.map((obj: any, index: number) => (
              <div key={index} style={{width: '100%'}}>
                <div style={{padding: 10}}>
                  <div style={{cursor: 'pointer'}} onClick={() => Router.push(`/events/${obj._id}`)}>
                    <h3 className="mt-0">{obj.title}</h3>
                    <p>Distribution: {dayjs(obj.startDate).format("MMMM DD, YYYY")} from {dayjs(obj.startDate).format("hh:mm A")} - {dayjs(obj.endDate).format("hh:mm A")}</p>
                    <p>{obj.countAttended} members attending out of {obj.maxAttended}</p>
                  </div>
                  {
                    isJoined(obj.attendes) && (
                      <div style={{textAlign: 'center'}}>
                        <Button style={{ textTransform: 'none', fontSize: 16, maxWidth: '350px', width: '100%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained" onClick={() => join(obj._id)}>
                          {"Join this event"}
                        </Button>
                      </div>
                    )
                  }
                </div>
                <hr/>
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.bottomTicky}>
        <div className={styles.bottomTab}>
          <Link href='/request' passHref>
          <div style={{height:'100%',width:100,flexDirection:'column',display:'flex',justifyContent:'space-evenly'}}>
            <FontAwesomeIcon
              style={{width:'100%'}}
              icon={faHandsHelping}
              className="cursor-pointer icon-custom"
            />
            <div style={{textAlign:'center'}}>Requests</div>
            </div>
          </Link>
          <Link href='/' passHref>
            <Image src='/icon/Home.svg' width='100%' height='60%'/>
          </Link>
          <div>
            <Image src='/icon/Events.svg' width='100%' height='60%'/>
            </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
