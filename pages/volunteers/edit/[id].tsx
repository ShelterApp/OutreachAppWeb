import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { userService } from "services";
import FormEditVol from "component/FormEditVol";
import { useRouter } from "next/router";

const Edit: NextPage = () => {
  const router = useRouter();
  const [vol, setVol] = useState();
  const { id } = router.query;


  useEffect(() => {
    const fetch = async () => {
      const res = await userService.getById(id);
      if (res && res._id) {
        setVol(res)
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
          vol && <FormEditVol vol={vol}/>
        }
      </main>
    </div>
  );
};

export default Edit;
