import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { organizationService } from "services";
import FormEditOrg from "component/FormEditOrg";
import { useRouter } from "next/router";
import Header from 'component/Header';
import Container from '@mui/material/Container';

const Edit: NextPage = () => {
  const router = useRouter();
  const [org, setOrg] = useState();
  const { id } = router.query;


  useEffect(() => {
    const fetch = async () => {
      const org = await organizationService.get(id);
      if (org && org._id) {
        setOrg(org)
        return;
      }

      router.push('/404')
    }

    fetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <main className={styles.mainTop}>
      <Header title='Update Organization' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
        {
          org && <FormEditOrg org={org}/>
        }
      </div>
      </Container>
    </main>
  );
};

export default Edit;
