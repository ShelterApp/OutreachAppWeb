import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { organizationService, alertService } from "services";
import Grid from '@mui/material/Grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from "component/ConfirmationPopUp";
import Header from 'component/Header';

const Index: NextPage = () => {
  const router = useRouter();
  const [orgs, setOrgs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await organizationService.list();
      setOrgs(res.items)
    }
    fetchData()
  }, []);

  const edit = (id: string) => {
    router.push(`/organizations/edit/${id}`)
  }

  const remove = async (id: string) => {
    await organizationService._delete(id)
    const new_orgs = orgs.filter( org => org._id !== id);
    setOrgs(new_orgs);
    alertService.success('Remove this organization successful')
  }

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
    <Header title='Manage Organizations' back='/' />
          <Grid container>
        <Grid item xs={5}>
          <h3 className="text-center"><b>Name</b></h3>
        </Grid>
        <Grid item xs={5}>
          <h3 className="text-center"><b>City</b></h3>
        </Grid>
        <Grid item xs={2}>
        </Grid>
        {
          orgs.map((org: any) =>
            <React.Fragment key={org._id}>
              <Grid item xs={5} className="text-center item-volunteer">
                {org.name}
              </Grid>
              <Grid item xs={5} className="text-center item-volunteer">
                {org.address}
              </Grid>
              <Grid item xs={2} className="text-center item-volunteer">
                <EditOutlinedIcon className="cursor-pointer me-2" fontSize="small" onClick={() => edit(org._id)}/>
                <DeleteIcon className="cursor-pointer" fontSize="small" onClick={() => handleOpenAlert(org._id)}/>
              </Grid>
            </React.Fragment>
          )
        }
      </Grid>
      <AlertDialog
        title={'Do you want to delete this organization?'}
        open={openAlert}
        handleClose={handleCloseAlert}
        handleClickYes={handleClickYes}
      />
    </main>
  );
};

export default Index;
