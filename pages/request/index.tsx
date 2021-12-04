import type { NextPage } from "next";
import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import { userService } from "services";
import Header from 'component/Header';
import PanToolIcon from '@mui/icons-material/PanTool';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Button from '@mui/material/Button';
import { requestService } from 'services';
import Link from "next/link";
import moment from 'moment';
const containerStyle: any = {
  width: '100%',
  // height: 'calc(100vh - 155px)',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};
const Request: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState([] as number[]);

  useEffect(() => {
    getData();
  }, []);
  const getData = async (type: number) => {
    const condition = { type: type || null };
    const item = await requestService.list(condition);
    setData(item.items);
    navigator.geolocation.getCurrentPosition((position) => {
      if (position.coords)
        setLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
    });
  }
  const getDistanceFromLatLonInKm=(lat1:number, lon1:number, lat2:number, lon2:number)=> {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c*0.621371; // Distance in km
    return  Math.round(d*100)/100 ;
  }
  
  const deg2rad=(deg:number)=> {
    return deg * (Math.PI/180)
  }

  const renderItem = (item, index) => {
    let distance=0;
    if(item.location?.coordinates && location) distance= getDistanceFromLatLonInKm(item.location.coordinates[0],item.location.coordinates[1],location[0],location[1]);
    // console.log(distance);
    return <div key={index} style={{ paddingTop: 5 }}>
      <div style={{ fontSize: 20,paddingLeft:10, fontWeight: 'bold',position:'relative' }}>
        {item.name}
       { distance && <div style={{position:'absolute', right:10,top:0}}>
        {distance} Miles
      </div>} 
      </div>
      <div style={{ paddingTop: 7,paddingLeft:10, }}> Locking for {item.requestInfo.cate?.parentCateName}</div>
      <div style={{ paddingTop: 7,paddingLeft:10, }}>Reported by {item.name} {moment(item.updatedAt).fromNow()}</div>
      <div style={{ paddingTop: 10,paddingBottom:5 }}>
        <Button style={{ textTransform: 'none', width: '80%', marginLeft: '10%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"
          onClick={() => getData(1)} >
          Claim Request
        </Button>
      </div>
    {index !=data.length-1 && <div style={{ width: '100%', height: 2, backgroundColor: 'grey', marginTop: 10 }} />}  
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
      <div className={styles.bottomTicky} >
        <div style={{ height: 40, width: '100%', }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Button style={{ textTransform: 'none', width: '40%', borderRadius: 20, backgroundColor: '#5952ff' }} variant="contained"
              onClick={() => getData(1)} >
              User Request
        </Button>
            <Button style={{ textTransform: 'none', borderRadius: 100, backgroundColor: '#5952ff' }} variant="contained" onClick={() => getData()} >
              All
        </Button>
            <Button style={{ textTransform: 'none', width: '40%', borderRadius: 20, backgroundColor: '#5952ff' }} variant="contained" onClick={() => getData(3)} >
              Camp Request
        </Button>
          </div>
        </div>
        <div className={styles.bottomTab}>
          <div>
            <PanToolIcon className="cursor-pointer"
              fontSize="large" />
          </div>
          <Link href='/' passHref>
            <HouseSidingIcon className="cursor-pointer"
              fontSize="large" />
          </Link>
          <div>
            <RecordVoiceOverIcon className="cursor-pointer"
              fontSize="large" />
          </div>
        </div>
      </div>


    </main>
  );
};

export default Request;
