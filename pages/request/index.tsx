import type { NextPage } from "next";
import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import { userService, alertService } from "services";
import Header from 'component/Header';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Button from '@mui/material/Button';
import { requestService } from 'services';
import Link from "next/link";
import moment from 'moment';
// import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faHandsHelping } from "@fortawesome/free-solid-svg-icons";

const containerStyle: any = {
  width: '100%',
  minHeight: 'calc(100vh - 155px)',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};
const Request: NextPage = () => {
  // const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState([] as number[]);
  const [indexTab, setIndexTab] = useState<number>(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    getData(0);
    return () => subscription.unsubscribe();

  }, []);
  const getData = async (type: number) => {
    const condition = { type: type || null, status: 1, limit: 100 };
    const item = await requestService.list(condition);
    setData(item.items);
    setIndexTab(type);
    navigator.geolocation.getCurrentPosition((position) => {
      if (position.coords)
        setLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
    });
  }

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 0.621371; // Distance in km
    return Math.round(d * 100) / 100;
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  const claimRequest = async (id: string) => {
    const result = await requestService.update(id, { status: 3 });
    if (result.status == 204) {
      getData(indexTab);
      alertService.success("Claim Request successful. ");
    }
  }

  const renderItem = (item: any, index: number) => {
    let distance = 0;
    const reportText = (user.user._id == item.createdBy?._id ? `Self Reported ` : `Reported by ${item.name} `) + `${moment(item.updatedAt).fromNow()}`;
    if (item.location?.coordinates && location) distance = getDistanceFromLatLonInKm(item.location.coordinates[1], item.location.coordinates[0], location[0], location[1]);
    if (item.type == 3) return <div key={index} style={{ paddingTop: 5 }}>
      <Link href={`/request/detail/${item._id}`} passHref>
        <div
          style={{ fontSize: 20, paddingLeft: 10, fontWeight: 'bold', position: 'relative' }}>
          {item.name}
          {!!distance && <div style={{ position: 'absolute', right: 10, top: 0 }}>
            {distance} Miles
    </div>}
        </div>
      </Link>

      {!!item.requestInfo.supplies[0]?.supplyName && <div style={{ paddingTop: 7, paddingLeft: 10, }}> Locking for {item.requestInfo.supplies[0]?.supplyName}</div>}
      <div style={{ paddingTop: 7, paddingLeft: 10, }}>{reportText}</div>
      <div style={{ paddingTop: 10, paddingBottom: 5 }}>
        <Button style={{ textTransform: 'none', fontSize: 16, width: 180, margin: 'auto', padding: '5px 10px', borderRadius: 8, backgroundColor: '#5952ff',display:'block' }} variant="contained"
          onClick={() => claimRequest(item._id)} >
          Claim Request
      </Button>
      </div>
      {index != data.length - 1 && <div style={{ width: '100%', height: 2, backgroundColor: 'grey', marginTop: 10 }} />}
    </div>;
    return <div key={index} style={{ paddingTop: 5 }}>
      <Link href={`/request/detail/${item._id}`} passHref>
        <div style={{ fontSize: 20, paddingLeft: 10, fontWeight: 'bold', position: 'relative' }}>
          {item.name}
          {!!distance && <div style={{ position: 'absolute', right: 10, top: 0 }}>
            {distance} Miles
      </div>}
        </div>
      </Link>
      <div style={{ paddingTop: 7, paddingLeft: 10, }}> Locking for {item.requestInfo.cate?.parentCateName}</div>
      <div style={{ paddingTop: 7, paddingLeft: 10, }}>{reportText}</div>
      <div style={{ paddingTop: 10, paddingBottom: 5 }}>
      <Button style={{ textTransform: 'none', fontSize: 16, width: 180, margin: 'auto', padding: '5px 10px', borderRadius: 8, backgroundColor: '#5952ff',display:'block' }} variant="contained"
          onClick={() => claimRequest(item._id)} >
          Claim Request
        </Button>
      </div>
      {index != data.length - 1 && <div style={{ width: '100%', height: 2, backgroundColor: 'grey', marginTop: 10 }} />}
    </div>;
  }
  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='OutreachApp' user={user?.user} />
      <div className={styles.grid} style={{ paddingTop: 0, }}>
        <div style={containerStyle}>
          {!!data && data.map((item, index) => renderItem(item, index))}
        </div>
      </div>
      <div className={styles.bottomTicky}>
        <div style={{ height: 40, width: '100%', backgroundColor: '#cdcad1', borderTopColor: 'f6f3f3', borderWidth: 1, paddingTop: 3 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', }}>
            <Button style={{ textTransform: 'none', width: '40%', borderRadius: 20, color: indexTab == 1 ? 'white' : '#5952FF', backgroundColor: indexTab == 1 ? '#5952FF' : 'white' }} variant='contained'
              onClick={() => getData(1)} >
              User Request
        </Button>
            <Button style={{ textTransform: 'none', borderRadius: 100,color: !indexTab ? 'white' : '#5952FF', backgroundColor: !indexTab ? '#5952FF' : 'white'  }} variant="contained" onClick={() => getData(0)} >
              All
        </Button>
            <Button style={{ textTransform: 'none', width: '40%',  borderRadius: 20, color: indexTab == 3 ? 'white' : '#5952FF', backgroundColor: indexTab == 3 ? '#5952FF' : 'white'  }} variant="contained" onClick={() => getData(3)} >
              Camp Request
        </Button>
          </div>
        </div>
        <div className={styles.bottomTab}>
          <div>
            <FontAwesomeIcon
              icon={faHandsHelping}
              className="cursor-pointer icon-custom"
            />
          </div>
          <Link href='/' passHref>
            <FontAwesomeIcon
              icon={faCampground}
              className="cursor-pointer icon-custom"
            />
          </Link>
          <div>
            <EventAvailableIcon className="cursor-pointer"
              fontSize="large" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Request;
