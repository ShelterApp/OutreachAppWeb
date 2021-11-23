import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { organizationService, alertService } from "services";
import Grid from "@mui/material/Grid";
import AlertDialog from "component/ConfirmationPopUp";
import Header from "component/Header";
import Table from "component/Table";

const Index: NextPage = () => {
  const router = useRouter();
  const [orgs, setOrgs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await organizationService.list();
      setOrgs(res.items);
    };
    fetchData();
  }, []);

  const edit = (id: string) => {
    router.push(`/organizations/edit/${id}`);
  };

  const remove = async (id: string) => {
    await organizationService._delete(id);
    const new_orgs = orgs.filter((org) => org._id !== id);
    setOrgs(new_orgs);
    alertService.success("Remove this organization successful");
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>();

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setSelectedOrg(null);
  };

  const handleOpenAlert = (id: string) => {
    setOpenAlert(true);
    setSelectedOrg(id);
  };

  const handleClickYes = () => {
    selectedOrg && remove(selectedOrg);
    handleCloseAlert();
  };

  return (
    <main className={styles.mainTop}>
      <Header title="Manage Organizations" back="/" />
      <Grid container className="mt-2">
        <Table
          list={orgs}
          names={["name", "address", "action"]}
          cols={["Name", "City", ""]}
          edit={edit}
          handleOpenAlert={handleOpenAlert}
        />
      </Grid>
      <AlertDialog
        title={"Do you want to delete this organization?"}
        open={openAlert}
        handleClose={handleCloseAlert}
        handleClickYes={handleClickYes}
      />
    </main>
  );
};

export default Index;
