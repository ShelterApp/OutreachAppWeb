import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { campsService, alertService } from "services";
import Grid from "@mui/material/Grid";
import AlertDialog from "component/ConfirmationPopUp";
import Header from "component/Header";
import Container from '@mui/material/Container';
import CampCard from "component/CampCard";

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async (condition?:any ) => {
    const res = await campsService.list(condition);
    setList(res.items);
  };

  const edit = (id: string) => {
    router.push(`/manage-camps/edit/${id}`);
  };

  const remove = async (id: string) => {
    await campsService._delete(id);
    const new_list = list.filter((org) => org._id !== id);
    setList(new_list);
    alertService.success("Remove this camp successful");
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

  const onChangeSearch=(e:string)=>{
    const condition={
      sortBy:'createdAt',
      sortType:'desc',
      keyword:e
    }
    fetchData(e?condition:null );
  }

  return (
    <main className={styles.mainTop}>
      <Header title="Manage Camps" back="/" displaySearch onChangeSearch={onChangeSearch}/>
      <Container maxWidth="sm">
        <Grid container className={'mt-2'}>
          {
            list.map((obj: any, index: number) => (
              <CampCard edit={edit} handleOpenAlert={handleOpenAlert} key={index} camp={obj}/>
            ))
          }
        </Grid>
      </Container>
      <AlertDialog
        title={"Do you want to delete this camp?"}
        open={openAlert}
        handleClose={handleCloseAlert}
        handleClickYes={handleClickYes}
      />
    </main>
  );
};

export default Index;
