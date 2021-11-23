import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService } from "services";
import Grid from "@mui/material/Grid";
import AlertDialog from "component/ConfirmationPopUp";
import Header from "component/Header";
import Table from "component/Table";

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await userService.list({ userType: "Volunteer" });
      setList(res.items);
    };
    fetchData();
  }, []);

  const edit = (id: string) => {
    router.push(`/volunteers/edit/${id}`);
  };

  const remove = async (id: string) => {
    await userService._delete(id);
    const new_list = list.filter((org) => org._id !== id);
    setList(new_list);
    alertService.success("Remove this user successful");
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
      <Header title="Manage Volunteers" back="/" />
      <Grid container className={'mt-2'}>
        <Table
          list={list}
          names={["name", "regionId.name", "action"]}
          cols={["Name", "City", ""]}
          edit={edit}
          handleOpenAlert={handleOpenAlert}
        />
      </Grid>
      <AlertDialog
        title={"Do you want to delete this volunteer?"}
        open={openAlert}
        handleClose={handleCloseAlert}
        handleClickYes={handleClickYes}
      />
    </main>
  );
};

export default Index;
