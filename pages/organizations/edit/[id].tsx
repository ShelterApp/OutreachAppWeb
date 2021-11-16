import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React from "react";
import { organizationService } from "services";
import FormEditOrg from "component/FormEditOrg";

const Edit: NextPage = ({ org }: any) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {
          org && <FormEditOrg org={org}/>
        }
      </main>
    </div>
  );
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '*' } }
    ],
    fallback: false
  };
}

export async function getStaticProps({ params }: any) {
  const org = await organizationService.get(params.id);
  if (!(org && org._id)) {
    return {
      notFound: true
    }
  }

  return {
    props: { org: org }
  }
}

export default Edit;
