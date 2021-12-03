import type { NextPage } from "next";
import React from "react";
import styles from "styles/Home.module.scss";
import Header from 'component/Header';
import FormCreateSupplyItem from "component/SupplyItem/FormCreateSupplyItem";
import Container from '@mui/material/Container';

const Add: NextPage = () => {
  return (
    <main className={styles.mainTop}>
      <Header title='Add Supply Item' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <FormCreateSupplyItem />
        </div>
      </Container>
    </main>
  );
};

export default Add;
