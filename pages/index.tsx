import type { NextPage } from "next";
import React from 'react';
import { useState, useEffect } from "react";
import { userService, campsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Link from "next/link";
import { use100vh } from 'react-div-100vh'
import Modal from 'react-modal';
import styles from "styles/Home.module.scss";
import ButtonC from "component/Button";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faCampground,faHandsHelping } from "@fortawesome/free-solid-svg-icons";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useRouter } from 'next/router'

// const center = ;
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
  const [center,setCenter]=useState({
    lat: 32.965557,
    lng: -96.71583
  });
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  } as any);

  const onUnmount = React.useCallback(function callback() {
    // setMap(null)
  }, [])

  const getCamp = async (index: number) => {
    const condition = { status: 1, };
    if (index) condition.type = index;
    const campsData = await campsService.list(condition);
    setIndexTab(index);
    setCamp(campsData.items);
  }

  const height = `${use100vh()}px`;
  const containerStyle: any = {
    width: '100%',
    height: `calc(${height ? height : '100vh'} - 155px)`,
    maxWidth: '1024px',
    position: 'relative',
    overflow: 'hidden'
  };
  const renderIcon=(type:any)=>{
    //return '/icon/camps.svg';
     if(type==1 ||type== 9) return '/icon/camps.svg';
     else if(type==3) return '/icon/Pets.svg';
     else if(type==5 ) return '/icon/RV_Camp.svg';
    // return '/icon/Frame_14.svg';
     else if(type==7) return '/icon/packing.svg';
  }
  // const router = useRouter();


  useEffect(() => {
    if (window.location.pathname != router.pathname) {
      router.push(`/${window.location.pathname}`)
    }

    const subscription = userService.user.subscribe((x: any) =>{
      if(x && x.user){
      getCamp(0);
      setUser(x);
        setCenter({
          lat:x.user.regionId.lat,
          lng: x.user.regionId.lng,
        })
      }
      
    } );
    return () => subscription.unsubscribe();
  }, []);


  const renderMarker = () => {
    const map = camp.map((item: any, index: number) =>
      <Marker key={index}
         icon={renderIcon(item.type)}
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
        style={customStyles} >
        <div style={{ fontSize: 20, padding: '6px 10px', fontWeight: 'bold' }}>{pickerCamp?.name}</div>
        <div className={styles.grid}>
          <ButtonC text="Drop Supplies" link={`/drop-supplies/${pickerCamp._id}`} />
          <div style={{paddingTop:10}}/>
          <ButtonC text="Request Supplies" link={`/request-supplies/${pickerCamp._id}`} />
          <div style={{paddingTop:10}}/>
          <ButtonC text="Camp Description" link={`/camp/detail/${pickerCamp._id}`} />
          <div style={{paddingTop:10}}/>
          <ButtonC text="Camp Details" link={`/camp/log/${pickerCamp._id}`}></ButtonC>
          <div style={{paddingTop:10}}/>
          <ButtonC text="Report Swept or Inactive " link={`/camp/report/${pickerCamp._id}`}></ButtonC>
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
              onUnmount={onUnmount} >
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
          <div style={{height:'100%',flexDirection:'column',display:'flex',justifyContent:'space-evenly', minWidth:70}}>
            <FontAwesomeIcon
              style={{width:'100%'}}
              icon={faHandsHelping}
              className="cursor-pointer icon-custom"
            />
            <div style={{textAlign:'center',width:'100%'}}>Requests</div>
            </div>
          </Link>
          <div style={{height:'100%',flexDirection:'column',display:'flex',justifyContent:'space-evenly',minWidth:70}}>
            <FontAwesomeIcon
              style={{width:'100%'}}
              icon={faCampground}
              className="cursor-pointer icon-custom"
            />
            <div style={{textAlign:'center',width:'100%'}}>Home</div>
          </div>
          <Link href='/events/list' passHref >
          <div>
            <EventAvailableIcon 
              style={{width:'100%',minWidth:70}}
              className="cursor-pointer"
              fontSize='large'
              />
            <div style={{textAlign:'center',width:'100%'}}>Events</div>
            </div>
          </Link>
        </div>
      </main>
  );
};

export default Home;
