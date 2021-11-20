import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React from "react";
import FormCreateOrg from "component/FormCreateOrg";
import Container from '@mui/material/Container';
import Header from 'component/Header';

const Add: NextPage = () => {
  return (
    <main className={styles.mainTop}>
      <Header title='Add Organization' back='/' />
      <Container maxWidth="sm">
      <div className={styles.grid}>
        <FormCreateOrg/>
        </div>
        </Container>
    </main>
  );
};

export default Add;
