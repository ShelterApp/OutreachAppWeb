import type { NextPage } from "next";
import React, { useState } from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import FormCreateEvent from "component/Event/FormCreateEvent";
import Container from '@mui/material/Container';
import SelectLocation from "component/Event/SelectLocation";
import { eventsService, alertService } from "services";
import { useRouter } from "next/router";

const Add: NextPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  const onSubmit = (i: number) => {
    setStep(i)
  }

  const previousBack = (i: number) => {
    setStep(i)
  }

  const _center = {
    lat: 32.965557,
    lng: -96.71583
  };
  const [center, setCenter] = useState(_center);
  const [zoom, setZoom] = useState(10);

  const createEvent = async (params: any) => {
    const res = await eventsService.create({
      ...params,
      location: {
        type: "Point",
        coordinates: [
          center.lng,
          center.lat
        ]
      },
    })
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/events/').then(() => {
        alertService.success('Event was created successful!')
      })
    }
  }

  return (
    <>
      {
        step === 1 && (
          <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
            <Header title='Add Events' back="/"/>
            <SelectLocation zoom={zoom} setZoom={setZoom} center={center} setCenter={setCenter} onSubmit={onSubmit}/>
          </main>
        )
      }
      {
        step === 2 && (
          <main className={styles.mainTop}>
            <Header title='Add Events' onClick={() => previousBack(1)} />
            <Container maxWidth="sm">
              <div className={styles.grid}>
                <FormCreateEvent onSubmit={createEvent} />
              </div>
            </Container>
          </main>
        )
      }
    </>
  );
};

export default Add;
