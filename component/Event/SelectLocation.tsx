/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { use100vh } from 'react-div-100vh'
interface SelectLocationProps {
  onSubmit: Function;
  center: any;
  setCenter: Function;
  setZoom: Function;
  zoom: any;
}

const SelectLocation = ({ onSubmit, center, setCenter, setZoom, zoom }: SelectLocationProps) => {
  const height = `${use100vh()}px`;
  const containerStyle: any = {
    width: '100%',
    height: `calc(${height ? height : '100vh'} - 115px)`,
    maxWidth: '1024px',
    position: 'relative',
    overflow: 'hidden'
  };

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
    <>
      <div className={styles.grid} style={{ paddingTop: 0 }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            ref={mapRef => (ref = mapRef)}
            onCenterChanged={() => {
              if (ref) {
                const lat = ref.state.map.center.lat(),
                  lng = ref.state.map.center.lng();
                const _zoom = ref.state.map.zoom;

                setCenter({ lat, lng });
                setZoom(_zoom)
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
    </>
  )
}

export default SelectLocation;
