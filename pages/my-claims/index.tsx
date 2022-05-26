import type { NextPage } from "next";
import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import { userService, alertService, requestService } from "services";
import Header from 'component/Header';
import Button from '@mui/material/Button';
import Link from "next/link";
import moment from 'moment';

const containerStyle: any = {
  width: '100%',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};
const MyClaims: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState([] as number[]);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    getData();
    return () => subscription.unsubscribe();

  }, []);
  const getData = async () => {
    const condition = { skip:0,  limit: 100 };
    const item = await requestService.myClaim(condition);
    setData(item.items);
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

  const release =async (id:string)=>{
    const result = await requestService.update(id, { status: 1 });
    getData();
    if (result.status == 204) {
      alertService.success("Release request successful.");
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

      {!!item.requestInfo.supplies[0]?.supplyName && <div style={{ paddingTop: 7, paddingLeft: 10, }}> Looking for {item.requestInfo.supplies[0]?.supplyName}</div>}
      <div style={{ paddingTop: 7, paddingLeft: 10, }}>{reportText}</div>
      <div style={{ paddingTop: 10, paddingBottom: 5 }}>
      <Link href={`/fulfill/${item._id}`} passHref>
      <Button style={{ textTransform: 'none', fontSize: 16, width: '45%', marginLeft: '3%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"  >
          Fulfill Request
      </Button>
        </Link>
        <Button style={{ textTransform: 'none', fontSize: 16, width: '45%', marginLeft: '3%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"
          onClick={() => release(item._id)} >
          Release Request
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
      <div style={{ paddingTop: 7, paddingLeft: 10, }}> Looking for {item.requestInfo.cate?.parentCateName}</div>
      <div style={{ paddingTop: 7, paddingLeft: 10, }}>{reportText}</div>
      <div style={{ paddingTop: 10, paddingBottom: 5 }}>
      <Link href={`/fulfill/${item._id}`} passHref>
      <Button style={{ textTransform: 'none', fontSize: 16, width: '45%', marginLeft: '3%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"  >
          Fulfill Request
      </Button>
        </Link>
        <Button style={{ textTransform: 'none', fontSize: 16, width: '45%', marginLeft: '3%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"
          onClick={() => release(item._id)} >
          Release Request
      </Button>
      </div>
      {index != data.length - 1 && <div style={{ width: '100%', height: 2, backgroundColor: 'grey', marginTop: 10 }} />}
    </div>;
  }
  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='My Claims' back='/' />
      <div className={styles.grid} style={{ paddingTop: 0, }}>
        <div style={containerStyle}>
          {!!data && data.map((item, index) => renderItem(item, index))}
        </div>
      </div>
    </main>
  );
};

export default MyClaims;
