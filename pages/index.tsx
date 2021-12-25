import type { NextPage } from "next";
import React from 'react';
import { useState, useEffect } from "react";
import { userService, campsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Link from "next/link";
import { use100vh } from 'react-div-100vh'
import Modal from 'react-modal';
import styles from "styles/Home.module.scss";
import ButtonC from "component/Button";
import Button from '@mui/material/Button';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faHandsHelping } from "@fortawesome/free-solid-svg-icons";

const center = {
  lat: 32.965557,
  lng: -96.71583
};
const customStyles = {
  content: {
    top: '40%',
    left: '0%',
    right: 'auto',
    bottom: '0',
    marginRight: '-50%',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white'
  },
};
const Home: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [camp, setCamp] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pickerCamp, setPickerCamp] = useState({});
  const [indexTab, setIndexTab] = useState<number>(0);

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

  const getCamp = async (index: number) => {
    const condition = { status: 1, };
    if (index) condition.type = index;
    const campsData = await campsService.list(condition);
    setIndexTab(index);
    setCamp(campsData.items);
    // console.log(campsData);

  }

  const height = `${use100vh()}px`;
  const containerStyle: any = {
    width: '100%',
    height: `calc(${height ? height : '100vh'} - 155px)`,
    maxWidth: '1024px',
    position: 'relative',
    overflow: 'hidden'
  };

  useEffect(() => {
    const subscription = userService.user.subscribe((x: any) => setUser(x));
    console.log(user);
    getCamp(0);
    return () => subscription.unsubscribe();
  }, []);

  const renderMarker = () => {
    const map = camp.map((item: any, index: number) =>
      <Marker key={index}
        onClick={() => {
          setPickerCamp(camp[index]);
          setShowModal(true);
        }}
        position={{ lat: item?.location.coordinates[1], lng: item.location.coordinates[0] }} />
    )
    return map
  }

  const renderModal = () => {
    return (
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={customStyles}
      >
        <div style={{ fontSize: 20, padding: '6px 10px', fontWeight: 'bold' }}>{pickerCamp?.name}</div>
        <div className={styles.grid}>
          <ButtonC text="View Camp Details" link={`/camp/detail/${pickerCamp._id}`} />
          <ButtonC text="Report Swept or Inactive " link={`/camp/report/${pickerCamp._id}`}></ButtonC>
          <ButtonC text="Camp Log" link={`/camp/log/${pickerCamp._id}`}></ButtonC>

        </div>
      </Modal>
    )
  }

  return (
    !user ? <Container maxWidth="sm">
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.titleName}>OutreachApp</div>
          <div className={styles.grid}>
            <ButtonC text="Login" link="/login"></ButtonC>
            <ButtonC text="Sign Up" link="/sign-up"></ButtonC>
            <ButtonC text="Request for Help" link="/help-screen"></ButtonC>
          </div>
        </main>
      </div>
    </Container> :
      <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
        <Header title='OutreachApp' user={user?.user} />
        <div className={styles.grid} style={{ paddingTop: 0 }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onUnmount={onUnmount}
            >
              {renderMarker()}
            </GoogleMap>
          ) : <></>}
        </div>
        {renderModal()}
        <div style={{ height: 40, width: '100%', backgroundColor: '#cdcad1', borderTopColor: 'f6f3f3', borderWidth: 1, paddingTop: 3 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', }}>
            <Button style={{ textTransform: 'none', width: '40%', borderRadius: 20, color: indexTab == 1 ? 'white' : '#5952FF', backgroundColor: indexTab == 1 ? '#5952FF' : 'white' }} variant='contained'
              onClick={() => getCamp(1)} >
              Camps
          </Button>
            <Button style={{ textTransform: 'none', width: '40%', borderRadius: 20, color: indexTab == 5 ? 'white' : '#5952FF', backgroundColor: indexTab == 5 ? '#5952FF' : 'white' }} variant='contained'
              onClick={() => getCamp(5)} >
                {`RV's`}
          </Button>
            <Button style={{ textTransform: 'none', borderRadius: 20, color: !indexTab ? 'white' : '#5952FF', backgroundColor: !indexTab ? '#5952FF' : 'white' }} variant="contained" onClick={() => getCamp(0)} >
              All
        </Button>
            <Button style={{ textTransform: 'none', width: '40%', borderRadius: 20, color: indexTab == 3 ? 'white' : '#5952FF', backgroundColor: indexTab == 3 ? '#5952FF' : 'white' }} variant="contained" onClick={() => getCamp(3)} >
              Pets
        </Button>
            <Button style={{ textTransform: 'none', width: '40%', borderRadius: 20, color: indexTab == 7 ? 'white' : '#5952FF', backgroundColor: indexTab == 7 ? '#5952FF' : 'white' }} variant='contained'
              onClick={() => getCamp(7)} >
              Parking
          </Button>
          </div>
        </div>
        <div className={styles.bottomTab}>
          <Link href='/request' passHref>
            <FontAwesomeIcon
              icon={faHandsHelping}
              className="cursor-pointer icon-custom"
            />
          </Link>
          <div>
            <FontAwesomeIcon
              icon={faCampground}
              className="cursor-pointer icon-custom"
            />
          </div>
          <div>
            <EventAvailableIcon className="cursor-pointer"
              fontSize="large" />
          </div>
        </div>
      </main>
  );
};

export default Home;
