import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { eventsService, alertService } from "services";
import Grid from "@mui/material/Grid";
import AlertDialog from "component/ConfirmationPopUp";
import Header from "component/Header";
import Container from '@mui/material/Container';
import EventCard from 'component/EventCard';

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await eventsService.list();
      setList(res.items);
    };
    fetchData();
  }, []);

  const edit = (id: string) => {
    router.push(`/events/edit/${id}`);
  };

  const remove = async (id: string) => {
    await eventsService._delete(id);
    const new_list = list.filter((org) => org._id !== id);
    setList(new_list);
    alertService.success("Remove this event successful");
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [selected, setSelected] = useState<any>();

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setSelected(null);
  };

  const handleOpenAlert = (id: string) => {
    setOpenAlert(true);
    setSelected(id);
  };

  const handleClickYes = () => {
    selected && remove(selected);
    handleCloseAlert();
  };

  return (
    <main className={styles.mainTop}>
      <Header title="Manage Events" back="/" />
      <Container maxWidth="sm">
        <Grid container className={'mt-2'}>
          {
            list.map((obj: any, index: number) => (
              <EventCard edit={edit} handleOpenAlert={handleOpenAlert} key={index} event={obj}/>
            ))
          }
        </Grid>
      </Container>
      <AlertDialog
        title={"Do you want to delete this event?"}
        open={openAlert}
        handleClose={handleCloseAlert}
        handleClickYes={handleClickYes}
      />
    </main>
  );
};

export default Index;
