import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "styles/Home.module.scss";
import {  campsService, } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker, } from '@react-google-maps/api';

const containerStyle: any = {
  width: '100%',
  height: '315px',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};

const CampDirection: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // const [camp, setCamp] = useState<any>({});
  const [location, setLocation] = useState({ });
  const [userLocation, setUserLocation] = useState({ });
  // const [directions, setDirections] = useState("");

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
        navigator.geolocation.getCurrentPosition((position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
        // setCamp(res);
        setLocation({lat:res.location.coordinates[1],lng:res.location.coordinates[0]})
      } 
    }

    fetch();
  }, []);

  return (
    <main className={styles.mainTop}>
      <Header title='Camp Direction' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid} style={{ paddingTop: 20 }}>
            {!!isLoaded &&
              (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={location}
                  // zoom={9}
                  onUnmount={onUnmount} >
                    {/* <DirectionsRenderer 
                    directions={
                      origin:userLocation,
                      destination:location,
                      travelMode: 'DRIVING'
                    }
                    destination={userLocation}
                    /> */}
                  <Marker position={location} />
                  <Marker position={userLocation} />
                  <></>
                </GoogleMap>
              )}
          </div>
      </Container>
    </main>
  );
};

export default CampDirection;
