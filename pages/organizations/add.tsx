import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React from "react";
import FormCreateOrg from "component/FormCreateOrg";

const Add: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <FormCreateOrg/>
      </main>
    </div>
  );
};

export default Add;
