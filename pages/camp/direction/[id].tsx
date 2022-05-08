import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "styles/Home.module.scss";
import {  campsService, } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker,DirectionsRenderer } from '@react-google-maps/api';

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
  const [location, setLocation] = useState({ lat: -73.97, lng: 40.77 });
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
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
      const destination= {lat:res.location.coordinates[1],lng:res.location.coordinates[0]};
      setLocation(destination)
      if (res._id){
        navigator.geolocation.getCurrentPosition((position) => {
          // const origin={lat: 48.60931203240536, lng: -122.33188984055126};
          const origin={ lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(origin);
        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin:origin ,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },(result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        })
        });
      } 
    }

    fetch();
  }, []);

  return (
    <main className={styles.mainTop}>
      <Header title='Camp Direction' back={`/camp/detail/${id}`} />
      <Container maxWidth="sm">
        <div className={styles.grid} style={{ paddingTop: 20 }}>
            {!!isLoaded &&location &&
              (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={location}
                   zoom={6}
                  onUnmount={onUnmount} >
                    <DirectionsRenderer 
                    directions={directions}
                    destination={userLocation}
                    />
                  <Marker position={location} />
                  <Marker position={userLocation} />
                </GoogleMap>
              )}
          </div>
      </Container>
    </main>
  );
};

export default CampDirection;
