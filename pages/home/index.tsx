import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import Button from "component/Button";
import Header from 'component/Header';
type Inputs = {
  email: string;
  password: string;
};

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <main className={styles.main}>
<Header title='Manage Volunteers'/>

        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <div className={stylesComponent.container}>
              <div className={styles.grid}>
                <Button text="Home" type="submit"></Button>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
