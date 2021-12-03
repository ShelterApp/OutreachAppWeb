import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supplyItemsService, alertService } from "services";
import Grid from "@mui/material/Grid";
import AlertDialog from "component/ConfirmationPopUp";
import Header from "component/Header";
import Table from "component/Table";

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await supplyItemsService.list();
      setList(res.items);
    };
    fetchData();
  }, []);

  const edit = (id: string) => {
    router.push(`/supply-items/edit/${id}`);
  };

  const remove = async (id: string) => {
    await supplyItemsService._delete(id);
    const new_list = list.filter((org) => org._id !== id);
    setList(new_list);
    alertService.success("Remove this supply item successful");
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
      <Header title="Manage Supply Items" back="/" />
      <Grid container className={'mt-2'}>
        <Table
          list={list}
          names={["supplyId.name", "qty", "action"]}
          cols={["Supply Name", "Quantity", ""]}
          edit={edit}
          handleOpenAlert={handleOpenAlert}
        />
      </Grid>
      <AlertDialog
        title={"Do you want to delete this supply item?"}
        open={openAlert}
        handleClose={handleCloseAlert}
        handleClickYes={handleClickYes}
      />
    </main>
  );
};

export default Index;
