import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { suppliesService } from "services";
import FormEditSupply from "component/Supply/FormEditSupply";
import { useRouter } from "next/router";
import Container from '@mui/material/Container';
import Header from 'component/Header';

const Edit: NextPage = () => {
  const router = useRouter();
  const [record, setRecord] = useState();
  const { id } = router.query;


  useEffect(() => {
    const fetch = async () => {
      const res = await suppliesService.get(id);
      if (res && res._id) {
        setRecord(res)
        return;
      }

      router.push('/404')
    }

    fetch()
  }, [id])

  return (
    <main className={styles.mainTop}>
    <Header title='Update Supply Item' back='/' />
    <Container maxWidth="sm">
      <div className={styles.grid}>
        {
          record && <FormEditSupply record={record}/>
        }
      </div>
      </Container>
    </main>
  );
};

export default Edit;
