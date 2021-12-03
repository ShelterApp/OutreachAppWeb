import React from 'react';
import { useState } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle:any = {
  width: '100%',
  height: 'calc(100vh - 115px)',
  maxWidth: '1024px',
  position: 'relative',
  overflow: 'hidden'
};

interface AddNewCamp {
  onSubmit: Function;
  center: any;
  setCenter: Function;
}

const AddNewCamp = ({ onSubmit, center, setCenter }: AddNewCamp) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  } as any);
  const [map, setMap] = React.useState(null)

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  let ref: any;
  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='Add New Camp' back="/"/>
      <div className={styles.grid} style={{ paddingTop: 0 }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            ref={mapRef => (ref = mapRef)}
            onCenterChanged={() => {
              if (ref) {
                let lat = ref.state.map.center.lat(),
                  lng = ref.state.map.center.lng();
                setCenter({ lat, lng });
                // console.log(ref.state.map.center.lat());
                // console.log(ref.state.map.center.lng());
                // console.log(ref.state.map.zoom);
              }
            }}
            // onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker
              position={center}
            />
            <></>
          </GoogleMap>
        ) : <></>}
      </div>
      <div style={{
        backgroundColor: '#fff', height: 60, width: '100%',
        alignItems: 'center',
        color: 'white',
        display: 'flex', flexDirection: 'row', justifyContent: 'space-around'
      }}>
        <Button text="Next" onClick={() => onSubmit(2)} />
      </div>
    </main>
  )
}

export default AddNewCamp;
