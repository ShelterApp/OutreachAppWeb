import type { NextPage } from "next";
import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import { userService,campsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import PanToolIcon from '@mui/icons-material/PanTool';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Link from "next/link";

const containerStyle:any = {
  width: '100%',
  height: 'calc(100vh - 115px)',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};
const center = {
  lat: 32.965557,
  lng: -96.71583
};
const Home: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  } as any);
  // const [map, setMap] = React.useState(null)
  // const onLoad = React.useCallback(function callback(map) {
  //   const bounds = new window.google.maps.LatLngBounds();
  //   console.log(bounds);
  //   map.fitBounds(bounds);
  //   setMap(map)
  // }, [])
  const onUnmount = React.useCallback(function callback() {
    // setMap(null)
  }, [])

  const getCamp =async ()=>{
const campsData=await campsService.list();
console.log(campsData);

  }

  useEffect(() => {
    const subscription = userService.user.subscribe((x:any) => setUser(x));
    getCamp();
    return () => subscription.unsubscribe();
  }, []);

  return (
    !user ? <Container maxWidth="sm">
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.titleName}>OutreachApp</div>
          <div className={styles.grid}>
            <Button text="Login" link="/login"></Button>
            <Button text="Sign Up" link="/sign-up"></Button>
            <Button text="Request for Help" link="/help-screen"></Button>
          </div>
        </main>
      </div>
    </Container> :
      <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
        <Header title='OutreachApp' user={user?.user}/>
        <div className={styles.grid} style={{ paddingTop: 0 }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              // onLoad={onLoad}
              onUnmount={onUnmount}
            >
              { /* Child components, such as markers, info windows, etc. */}
              <></>
            </GoogleMap>
          ) : <></>}
        </div>
        <div className={styles.bottomTab}>
          <Link href='/request' passHref>
          <PanToolIcon className="cursor-pointer"
              fontSize="large" />
          </Link>
          <div>
            <HouseSidingIcon className="cursor-pointer"
              fontSize="large" />
          </div>
          <div>
            <RecordVoiceOverIcon className="cursor-pointer"
              fontSize="large" />
          </div>
        </div>
      </main>
  );
};

export default Home;
