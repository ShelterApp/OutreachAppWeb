import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { requestService } from "services";
import { useRouter } from "next/router";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import TodayIcon from '@mui/icons-material/Today';
import moment from 'moment';
import { GoogleMap, useJsApiLoader,Marker } from '@react-google-maps/api';
import Button from '@mui/material/Button';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import CabinIcon from '@mui/icons-material/Cabin';
import AssignmentIcon from '@mui/icons-material/Assignment';
const containerStyle:any = {
  width: '100%',
  height: '315px',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};
const Detail: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const { id } = router.query;
  const [location,setLocation]=useState({lat: 41.75, lng: 1.8 });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  } as any);

  const onUnmount = React.useCallback(function callback() {
    // setMap(null)
  }, [])


  const claimRequest = async (id: string) => {
    const result = await requestService.update(id, { status: 3 });
    if (result.status == 204) {
      // getData(indexTab);
      alertService.success("Claim Request successful");
    }
  }

  useEffect(() => {
    const fetch = async () => {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords)
          setLocation({lat : position.coords.latitude, lng: position.coords.longitude});
      });
      const res = await requestService.get(id);
      if (res && res._id) {
        console.log(res);
        setData(res)
        return;
      }
    }

    fetch()
  }, [id])



  return (
    <main className={styles.mainTop}>
      <Header title={data.type==3?'Camp Request Details':'User Request Details'} back='/request' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <div style={{ width: '100%', flexDirection: 'row', display: 'flex' }}>
            {data.type==3?<CabinIcon fontSize="large" />:<PersonIcon fontSize="large" /> } 
            <div style={{ fontSize: 20, padding: '6px 10px',fontWeight:'bold' }}>{data.name}</div>
            {data.type== 3 && 
            <Button style={{ textTransform: 'none', width: '35%', whiteSpace:'nowrap', marginLeft: '10%', padding: '4px 10px', borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained" >
          Camp Deatails
      </Button>}
          </div>
          {!!data.requestInfo?.email && <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
            <MailIcon fontSize="large" />
            <div style={{ fontSize: 20, padding: '7px 10px' }}>{data.requestInfo?.email}</div>
          </div> } 
          {!!data.requestInfo?.phone &&  <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
            <ContactPhoneIcon fontSize="large" />
            <div style={{ fontSize: 20, padding: '7px 10px' }}>{data.requestInfo?.phone}</div>
          </div>}
         
          {!!data.requestInfo?.cate.parentCateName &&<div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
            <LeaderboardIcon fontSize="large" />
            <div style={{ fontSize: 20, padding: '7px 10px' }}>{data.requestInfo?.cate.parentCateName}</div>
          </div>}
          <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
            {data.type==3?<AssignmentIcon fontSize="large"  />: <FastfoodIcon fontSize="large" />  }
            <div style={{ fontSize: 20, padding: '7px 10px' }}> {data.type==3?`Requested `: `I'm looking for`} {data.description}</div>
          </div>
          <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
            <TodayIcon fontSize="large" />
            <div style={{ fontSize: 20, padding: '7px 10px' }}>{moment(data.updatedAt).format('LLL')}</div>
          </div>
          <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
            <AssistantDirectionIcon fontSize="large" />
            <div style={{ fontSize: 20, padding: '7px 10px' }}>Get Direction</div>
          </div>
          <div className={styles.grid} style={{ paddingTop: 20 }}>
          {!!isLoaded &&
           (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location}
              zoom={19}
               onUnmount={onUnmount} >
              <Marker position={location}/>
              {!!data.requestInfo?.location && 
              <Marker position={{lat :data.requestInfo?.location.coordinates[1],
              lng:data.requestInfo.location.coordinates[0] }}/>}
              <></>
            </GoogleMap>
          ) }
          </div>
          <div style={{ paddingTop: 10, paddingBottom: 5,width:'100%' }}>
        <Button style={{ textTransform: 'none',fontSize:16,  width: '80%', marginLeft: '10%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"
          onClick={() => claimRequest(data._id)} >
          Claim Request
      </Button>
      </div>
      <div style={{ paddingTop: 10, paddingBottom: 5,width:'100%' }}>
        <Button style={{ textTransform: 'none', width: '80%', marginLeft: '10%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"
          onClick={() => claimRequest(data._id)} >
          Share Request
      </Button>
      </div>
        </div>
      </Container>
    </main>
  );
};

export default Detail;
