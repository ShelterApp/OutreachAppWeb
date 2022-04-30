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
import produce from 'immer';

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
   
    fetchData();
  }, []);

  const fetchData = async (condition?:any) => {
    const res = await eventsService.list(condition);
    if (res && res.items) {
      setList(res.items);
    }
  };

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

  const handleUpdateMaxAttendes = async (id: string, num: number) => {
    const maxAttended = num < 0 ? 0 : num;

    const res = await eventsService.update(id, {maxAttended: maxAttended})
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      const index = list.findIndex(v => v._id === id);
      const _list: any = produce(list, (draftState: any[]) => {
        draftState[index].maxAttended = maxAttended;
      });

      setList(_list)
    }
  }

  const handleRemoveParticipant = async (id: string, userId: string, newAttended: any[]) => {
    const res = await eventsService.removeParticipant(id, {userId: userId})
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      const index = list.findIndex(v => v._id === id);
      const _list: any = produce(list, (draftState: any[]) => {
        draftState[index].attendes = [...newAttended];
      });
      setList(_list);
    }
  }

  const onChangeSearch=(e)=>{
    const condition={
      sortBy:'createdAt',
      sortType:'desc',
      keyword:e
    }
    fetchData(e?condition:null );
  }

  return (
    <main className={styles.mainTop}>
      <Header title="Manage Events" back="/" displaySearch onChangeSearch={onChangeSearch}/>
      <Container maxWidth="sm">
        <Grid container className={'mt-2'}>
          {
            list.map((obj: any, index: number) => (
              <EventCard edit={edit} handleOpenAlert={handleOpenAlert} handleUpdateMaxAttendes={handleUpdateMaxAttendes} handleRemoveParticipant={handleRemoveParticipant} key={index} event={obj}/>
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
