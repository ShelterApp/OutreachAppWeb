import React from 'react';
import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
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
  lat: -3.745,
  lng: -38.523
};
const Home: NextPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "API_KEY"
  })

  const [map, setMap] = React.useState(null)
  const height=window.innerHeight;
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='OutreachApp' />
      <div className={styles.grid} style={{paddingTop:0}}>
        {isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
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
