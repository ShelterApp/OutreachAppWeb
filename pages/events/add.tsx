import type { NextPage } from "next";
import React from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import FormCreateEvent from "component/Event/FormCreateEvent";
import Container from '@mui/material/Container';
import { eventsService, alertService } from "services";
import { useRouter } from "next/router";

const Add: NextPage = () => {
  const router = useRouter();

  const createEvent = async (params: any) => {
    const res = await eventsService.create({
      ...params
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
    <main className={styles.mainTop}>
      <Header title='Add Events' back={'/events'} />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <FormCreateEvent onSubmit={createEvent} />
        </div>
      </Container>
    </main>
  );
};

export default Add;
