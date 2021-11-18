import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React from "react";
import FormCreateVol from "component/FormCreateVol";

const Add: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <FormCreateVol/>
      </main>
    </div>
  );
};

export default Add;
