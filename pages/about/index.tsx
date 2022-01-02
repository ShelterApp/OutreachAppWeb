import type { NextPage } from "next";
import React, { useState,useEffect } from "react";
import styles from "styles/Home.module.scss";
import { userService } from "services";
import Header from 'component/Header';
import Container from '@mui/material/Container';

const About: NextPage = () => {
  const [value, setValue] = useState<string>('');
  const init =async ()=>{
    const res=await  userService.getPage('about_us');
    if(res._id){
      setValue(res.content);
    }
  }
  useEffect(()=>{
init();
  },[])

  return (
    <main className={styles.mainTop}>
      <Header title='About App' back='/' />
      <Container maxWidth="sm">
        <p dangerouslySetInnerHTML={{ __html: value }} />
      </Container>
    </main>
  );
};

export default About;
