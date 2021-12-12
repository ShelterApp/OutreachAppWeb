import type { NextPage } from "next";
import React, { useEffect,  } from "react";
// import { useRouter } from "next/router";
import styles from "styles/Home.module.scss";
// import Button from "component/Button";
// import {  campsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import Button from '@mui/material/Button';


const CampLog: NextPage = () => {
  // const router = useRouter();
  // const { id } = router.query;
  // const [camp, setCamp] = useState<any>({});
  // const [location, setLocation] = useState({ lat: 41.75, lng: 1.8 });
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  // } as any);

  // const onUnmount = React.useCallback(function callback() {
  //   // setMap(null)
  // }, [])

  useEffect(() => {
    // const fetch = async () => {
    //   const res = await campsService.getLog(id);
    //   if (res._id){
    //   } 
    // }

    // fetch();
  }, []);

  // const renderPeople = () => {
  //   return camp.people?.map((item:any, index:number) =>
  //     <div key={index} style={{ width: '100%', paddingTop: 5 }}>
  //       <div style={{ fontSize: 20, fontStyle: 'inherit', fontWeight: 'bold', paddingBottom: 10 }}><u> Person {index + 1} Details: </u></div>
  //       <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 7 }}>
  //         <div style={{ width: '45%', fontSize: 16 }}>Name: {item.name || 'N/A'}</div>
  //         <div style={{ width: '55%', fontSize: 16 }}>Age: {item.age || 'N/A'}</div>
  //       </div>
  //       <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 7 }}>
  //         <div style={{ width: '45%', fontSize: 16 }}>Gender: {item.gender || 'N/A'}</div>
  //         <div style={{ width: '55%', fontSize: 16 }}>Race: {item.race || 'N/A'}</div>
  //       </div>
  //       <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 7 }}>
  //         <div style={{ width: '45%', fontSize: 16 }}>Disability: {item.disabled || 'N/A'}</div>
  //         <div style={{ width: '55%', fontSize: 16 }}>Unhoused Since: {item.unhouseSince || 'N/A'}</div>
  //       </div>
  //     </div>)
  // };

  return (
    <main className={styles.mainTop}>
      <Header title='Camp Log' back='/' />
      <Container maxWidth="sm">
        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', paddingTop: 5 }}>
          <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> Name: </strong> {camp?.name}</div>
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
        {/* {renderPeople()} */}
          <div style={{ paddingTop: 10, paddingBottom: 25, width: '100%' }}>
            <Button style={{ textTransform: 'none', fontSize: 16, width: '90%', marginLeft: '5%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained"
              >
Get Directions     </Button>
          </div>
      </Container>
    </main>
  );
};

export default CampLog;
