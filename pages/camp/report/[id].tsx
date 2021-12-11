import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "styles/Home.module.scss";
// import Button from "component/Button";
import { campsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import Button from "component/Button";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const CampLog: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [value, setValue] = useState<number>(1);

  useEffect(() => {
    const fetch = async () => {
      const res = await campsService.getLog(id);
      if (res._id) {
      }
    }

    fetch();
  }, []);

  return (
    <main className={styles.mainTop}>
      <Header title='Report Camp Status' back='/' />
      <Container maxWidth="sm">
        <RadioGroup
          aria-label="gender"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={(e)=>setValue(e.target.value)}>
          <FormControlLabel value="1" control={<Radio />} label="Active Camp" />
          <FormControlLabel value="3" control={<Radio />} label="Inactive Camp" />
          <FormControlLabel value="5" control={<Radio />} label="Lost in Sweep" />
        </RadioGroup>
        <div className={styles.grid}>
          <Button text="Save" type="submit"></Button>
        </div>
      </Container>
    </main>
  );
};

export default CampLog;
