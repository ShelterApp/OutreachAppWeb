import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "styles/Home.module.scss";
import {  campsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Button from '@mui/material/Button';

const containerStyle: any = {
  width: '100%',
  height: '315px',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};
const campType={
  1:'Camps',
  3:'Camp with Pets',
  5:'RV',
  7:'Safe Parking',
  9:'Other'
}

const CampDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [camp, setCamp] = useState<any>({});
  const [location, setLocation] = useState({ lat: -73.97, lng: 40.77 });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  } as any);

  const onUnmount = React.useCallback(function callback() {
    // setMap(null)
  }, [])

  useEffect(() => {
    const fetch = async () => {
      const res = await campsService.get(id);
      if (res._id){
        setCamp(res);
        setLocation({lat:res.location.coordinates[1],lng:res.location.coordinates[0]})
      } 
    }

    fetch();
  }, []);

  const renderPeople = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (camp.people?.map((item:any, index:number) =>
      <div key={index} style={{ width: '100%', paddingTop: 5 }}>
        <div style={{ fontSize: 20, fontStyle: 'inherit', fontWeight: 'bold', paddingBottom: 10 }}><u> Person {index + 1} Details: </u></div>
        <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 7 }}>
          <div style={{ width: '45%', fontSize: 16 }}>Name: {item.name || 'N/A'}</div>
          <div style={{ width: '55%', fontSize: 16 }}>Age: {item.age || 'N/A'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 7 }}>
          <div style={{ width: '45%', fontSize: 16 }}>Gender: {item.gender || 'N/A'}</div>
          <div style={{ width: '55%', fontSize: 16 }}>Race: {item.race || 'N/A'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 7 }}>
          <div style={{ width: '45%', fontSize: 16 }}>Disability: {item.disabled || 'N/A'}</div>
          <div style={{ width: '55%', fontSize: 16 }}>Unhoused Since: {item.unhouseSince || 'N/A'}</div>
        </div>
      </div>))
  };

  return (
    <main className={styles.mainTop}>
      <Header title='Camp Description' back='/' />
      <Container maxWidth="sm">
      <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 10 }}>
          <div style={{ fontSize: 20, }}><strong> Camp Type: </strong> {campType[camp?.type]}</div>
        </div>
        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
          <div style={{ fontSize: 20, }}><strong> Name: </strong> {camp?.name}</div>
        </div>
        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
          <div style={{ fontSize: 20, }}><strong> Description: </strong>{camp?.description}</div>
        </div>
        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
          <div style={{ fontSize: 20, }}><strong> People #: </strong>{camp?.numOfPeople}</div>
        </div>
        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
          <div style={{ fontSize: 20, }}><strong> Pets #: </strong>{camp?.numOfPet}</div>
        </div>
        {renderPeople()}
        <div className={styles.grid} style={{ paddingTop: 20 }}>
            {!!isLoaded &&
              (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={location}
                  zoom={10}
                  onUnmount={onUnmount} >
                  <Marker position={location} />
                  <></>
                </GoogleMap>
              )}
          </div>
          <div style={{ paddingTop: 10, paddingBottom: 25, width: '100%' }}>
            <Button style={{ textTransform: 'none', fontSize: 16, width: '90%', marginLeft: '5%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }}
            onClick={()=>router.push(`/camp/direction/${id}`)}
            variant="contained"
              >Get Directions     
              </Button>
          </div>
      </Container>
    </main>
  );
};

export default CampDetail;
