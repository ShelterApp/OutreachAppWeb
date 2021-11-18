import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService } from "services";
import Grid from '@mui/material/Grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from "component/ConfirmationPopUp";

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await userService.list({ userType: 'Volunteer' });
      setList(res.items)
    }
    fetchData()
  }, []);

  const edit = (id: string) => {
    router.push(`/volunteers/edit/${id}`)
  }

  const remove = async (id: string) => {
    await userService._delete(id)
    const new_list = list.filter( org => org._id !== id);
    setList(new_list);
    alertService.success('Remove this user successful')
  }

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
    <div className={styles.container}>
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
          list.map((user: any) =>
            <React.Fragment key={user._id}>
              <Grid item xs={5} className="text-center">
                {user.name}
              </Grid>
              <Grid item xs={5} className="text-center">
                {user.regionId.name}
              </Grid>
              <Grid item xs={2} className="text-center">
                <EditOutlinedIcon className="cursor-pointer me-2" fontSize="small" onClick={() => edit(user._id)}/>
                <DeleteIcon className="cursor-pointer" fontSize="small" onClick={() => handleOpenAlert(user._id)}/>
              </Grid>
            </React.Fragment>
          )
        }
      </Grid>
      <AlertDialog
        title={'Do you want to delete this volunteer?'}
        open={openAlert}
        handleClose={handleCloseAlert}
        handleClickYes={handleClickYes}
      />
    </div>
  );
};

export default Index;
