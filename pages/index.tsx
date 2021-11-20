import type { NextPage } from "next";
import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import { userService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import PanToolIcon from '@mui/icons-material/PanTool';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
const containerStyle = {
  width: '10240px',
  height: '800px'
};
const center = {
  lat: 32.965557,
  lng: -96.71583
};
const Home: NextPage = () => {
  const [user, setUser] = useState(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  } as any)
  const [map, setMap] = React.useState(null)
  // const onLoad = React.useCallback(function callback(map) {
  //   const bounds = new window.google.maps.LatLngBounds();
  //   console.log(bounds);
  //   map.fitBounds(bounds);
  //   setMap(map)
  // }, [])
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });

    const subscription = userService.user.subscribe((x) => setUser(x));
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
        <Header title='OutreachApp' user={user.user}/>
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
        <div style={{
          backgroundColor: '#5952ff', height: 60, width: '100%',
          alignItems: 'center',
          color: 'white',
          display: 'flex', flexDirection: 'row', justifyContent: 'space-around'
        }}>
          <div>
            <PanToolIcon className="cursor-pointer"
              fontSize="large" />
          </div>
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
