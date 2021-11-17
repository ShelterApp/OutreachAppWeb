import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import Button from "component/Button";
import Header from 'component/Header';
import Container from '@mui/material/Container';


type Inputs = {
  email: string;
  password: string;
};

const Home: NextPage = () => {

  return (
   <main className={styles.mainTop}>
        <Header title='OutreachApp'/>
              <div className={styles.grid}>
                <Button text="Home" type="submit"></Button>
              </div>
      </main>
  );
};

export default Home;
