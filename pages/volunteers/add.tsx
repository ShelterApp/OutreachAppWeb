import type { NextPage } from "next";
import React from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import FormCreateVol from "component/FormCreateVol";
import Container from '@mui/material/Container';

const Add: NextPage = () => {
  return (
    <main className={styles.mainTop}>
      <Header title='Add Volunteer' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <FormCreateVol />
        </div>
      </Container>
    </main>
  );
};

export default Add;
