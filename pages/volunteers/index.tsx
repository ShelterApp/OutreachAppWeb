import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService } from "services";
import Grid from "@mui/material/Grid";
import AlertDialog from "component/ConfirmationPopUp";
import Header from "component/Header";
import Table from "component/Table";
import dayjs from 'dayjs';

const statuses = [
  {label: 'Active', value: 1},
  {label: 'Inactive', value: 0}
]

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
  
    fetchData();
  }, []);

  const fetchData = async (keyword?:string) => {
    const res = await userService.list({ keyword});
    setList(res.items);
  };

  const onChangeSearch=(e:string)=>{
    fetchData(e );
  }

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
      <Header title="Manage Volunteers" back="/" displaySearch onChangeSearch={onChangeSearch}/>
      <Grid container className={'mt-2'}>
        <Table
          list={
            list.map( o => {
              const status = statuses.find(oo => oo.value == o.status);
              const rec: object = {
                ...o,
                status: status ? status.label : '',
                lastedLoginAt: o.lastedLoginAt ? dayjs(o.lastedLoginAt).format("MMMM DD, YYYY") : 'No data',
                createdBy: o.createdBy ? o.createdBy.name : 'Signup'
              }
              return rec;
            })
          }
          names={["name", "regionId.name", 'userType', 'status', 'lastedLoginAt', "createdBy", "action"]}
          cols={["Name", "City", "Role", 'Status', "Last Login", "Created Info"]}
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
