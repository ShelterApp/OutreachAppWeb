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


const CampLog: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [value, setValue] = useState<number>(1);

  const onClick = async () => {
    const req = {
      status: value,
    }
    const res =await campsService.changeStatus(id, req);
    console.log(res);
  }

  return (
    <main className={styles.mainTop}>
      <Header title='Report Camp Status' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <RadioGroup
            aria-label="gender"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}>
            <FormControlLabel value={1} control={<Radio />} label="Active Camp" />
            <FormControlLabel value={3} control={<Radio />} label="Inactive Camp" />
            <FormControlLabel value={5} control={<Radio />} label="Lost in Sweep" />
          </RadioGroup>
          <Button text="Save" type="submit" onClick={() => onClick()}></Button>
        </div>
      </Container>
    </main>
  );
};

export default CampLog;
