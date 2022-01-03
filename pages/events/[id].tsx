import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import Container from '@mui/material/Container';
import { eventsService, alertService, userService } from "services";
import { useRouter } from "next/router";
import MailIcon from '@mui/icons-material/Mail';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import TodayIcon from '@mui/icons-material/Today';
import PersonIcon from '@mui/icons-material/Person';
import DetailsIcon from '@mui/icons-material/Details';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { getAddress } from "services/map.service";

const Show: NextPage = () => {
  const router = useRouter();
  const [record, setRecord] = useState<any>();
  const { id } = router.query;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APIKEY_MAP
  } as any);
  const [location, setLocation] = useState({ lat: 41.75, lng: 1.8 });
  const containerStyle: any = {
    width: '100%',
    height: '315px',
    maxWidth: '1024px',
    position: 'relative',
    overflow: 'hidden'
  };

  const fetch = async () => {
    const res = await eventsService.get(id);
    if (res && res._id) {

      const address = await getAddress(res.address);
      if (address.results[0]) {
        setLocation(address.results[0].geometry.location)
      }
      setRecord(res)

      return;
    }
  }
  useEffect(() => {
    fetch()
  }, [id])

  const onUnmount = React.useCallback(function callback() {
    // setMap(null)
  }, [])

  const user = userService.userValue.user;

  const isJoined = (attendes: any[]) => {
    const _user = attendes.find((obj: any) => obj.userId === user._id);
    return !_user;
  }

  const join = async (id: string) => {
    const res = await eventsService.join(id);
    if (res && res.statusCode === 400) {
      alertService.error(res.message)
    } else {
      fetch();
      alertService.success("Join this event successful");
    }
  }


  return (
    <React.Fragment>
      {
        record && (
          <main className={styles.mainTop}>
            <Header title='Event Details' back='/events/list' />
            <Container maxWidth="sm">
              <div style={{ width: '100%', flexDirection: 'row', gridColumnGap: 10, display: 'flex', paddingTop: 5 }}>
                <DetailsIcon fontSize="large" />
                <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> {record.title}</strong></div>
              </div>
              <div style={{ width: '100%', flexDirection: 'row', gridColumnGap: 10, display: 'flex', paddingTop: 5 }}>
                <div style={{ fontSize: 16, padding: '7px 0px' }}>{record.description}</div>
              </div>
              <div style={{ width: '100%', flexDirection: 'row', gridColumnGap: 10, display: 'flex', paddingTop: 5 }}>
                <TodayIcon fontSize="large" />
                <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> {dayjs(record.startDate).format("MM/DD/YY")} from {dayjs(record.startDate).format("h:mm A")} - {dayjs(record.endDate).format("h:mm A")}</strong></div>
              </div>
              <div style={{ width: '100%', flexDirection: 'row', gridColumnGap: 10, display: 'flex', paddingTop: 5 }}>
                <ContactPhoneIcon fontSize="large" />
                <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> {record.contactPhone}</strong></div>
              </div>
              <div style={{ width: '100%', flexDirection: 'row', gridColumnGap: 10, display: 'flex', paddingTop: 5 }}>
                <MailIcon fontSize="large" />
                <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> {record.contactEmail}</strong></div>
              </div>
              <div style={{ width: '100%', flexDirection: 'row', gridColumnGap: 10, display: 'flex', paddingTop: 5 }}>
                <PersonIcon fontSize="large" />
                <div style={{ fontSize: 20, padding: '7px 0px' }}><strong> {`Attendees (${record.attendes.length}/${record.maxAttended})`}</strong></div>
              </div>
              <div style={{ width: '100%', flexDirection: 'row', gridColumnGap: 10, display: 'flex', paddingTop: 5 }}>
                <AssistantDirectionIcon fontSize="large" />
                <div style={{ fontSize: 20, padding: '7px 10px' }}><strong>Get Directions</strong></div>
              </div>
              <div className={styles.grid} style={{ paddingTop: 20 }}>
                {!!isLoaded &&
                  (
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={location}
                      zoom={13}
                      onUnmount={onUnmount} >
                      <Marker position={location} />
                      <></>
                    </GoogleMap>
                  )}
              </div>
              {
                isJoined(record.attendes) && (
                  <div style={{ paddingTop: 10, paddingBottom: 25, width: '100%' }}>
                    <Button style={{ textTransform: 'none', fontSize: 16, width: '90%', marginLeft: '5%', padding: 9, borderRadius: 10, backgroundColor: '#5952ff' }} variant="contained" onClick={() => join(record._id)}>
                      Join this event
                    </Button>
                  </div>
                )
              }
            </Container>
          </main>
        )
      }
    </React.Fragment>
  );
};

export default Show;
