import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import FormCreateEvent from "component/Event/FormCreateEvent";
import Container from '@mui/material/Container';
import SelectLocation from "component/Event/SelectLocation";
import { eventsService, alertService } from "services";
import { useRouter } from "next/router";

const Edit: NextPage = () => {
  const router = useRouter();
  const [record, setRecord] = useState();
  const { id } = router.query;
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
    const data = {
      ...params,
      location: {
        type: "Point",
        coordinates: [
          center.lng,
          center.lat
        ]
      },
    };
    const res = await eventsService.update(id, data)
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/events/').then(() => {
        alertService.success('Event was updated successful!')
      })
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const res = await eventsService.get(id);
      if (res && res._id) {
        setRecord(res)
        setCenter({
          lat: res.location.coordinates[1],
          lng: res.location.coordinates[0]
        })

        return;
      }
    }

    fetch()
  }, [id])

  return (
    <React.Fragment>
      {
        record && (
          <>
            {
              step === 1 && (
                <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
                  <Header title='Edit Events' back="/"/>
                  <SelectLocation zoom={zoom} setZoom={setZoom} center={center} setCenter={setCenter} onSubmit={onSubmit}/>
                </main>
              )
            }
            {
              step === 2 && (
                <main className={styles.mainTop}>
                  <Header title='Edit Events' onClick={() => previousBack(1)} />
                  <Container maxWidth="sm">
                    <div className={styles.grid}>
                      <FormCreateEvent data={record} onSubmit={createEvent} />
                    </div>
                  </Container>
                </main>
              )
            }
          </>
        )
      }
    </React.Fragment>
  );
};

export default Edit;
