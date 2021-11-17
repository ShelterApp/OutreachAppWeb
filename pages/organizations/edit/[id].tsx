import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { organizationService } from "services";
import FormEditOrg from "component/FormEditOrg";
import { useRouter } from "next/router";

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
    <div className={styles.container}>
      <main className={styles.main}>
        {
          org && <FormEditOrg org={org}/>
        }
      </main>
    </div>
  );
};

export default Edit;
