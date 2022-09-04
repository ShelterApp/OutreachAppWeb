import type { NextPage } from "next";
import React from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import FormCreateSupply from "component/Supply/FormCreateSupply";
import Container from '@mui/material/Container';

const Add: NextPage = () => {
  return (
    <main className={styles.mainTop}>
      <Header title='Add New Supply' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <FormCreateSupply />
        </div>
      </Container>
    </main>
  );
};

export default Add;
