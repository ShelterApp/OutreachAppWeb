import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import FormCreateEvent from "component/Event/FormCreateEvent";
import Container from '@mui/material/Container';
import { eventsService, alertService } from "services";
import { useRouter } from "next/router";

const Edit: NextPage = () => {
  const router = useRouter();
  const [record, setRecord] = useState();
  const { id } = router.query;

  const createEvent = async (params: any) => {
    const data = {
      ...params
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

        return;
      }
    }

    fetch()
  }, [id])

  return (
    <React.Fragment>
      {
        record && (
          <main className={styles.mainTop}>
            <Header title='Edit Events' back='/events' />
            <Container maxWidth="sm">
              <div className={styles.grid}>
                <FormCreateEvent data={record} onSubmit={createEvent} />
              </div>
            </Container>
          </main>
        )
      }
    </React.Fragment>
  );
};

export default Edit;
