import type { NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import { userService } from "services";
import Container from '@mui/material/Container';

const Home: NextPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  const logout = () => {
    userService.logout();
  };

  return (
    <Container maxWidth="sm">

    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          {user ? (
            <Button text="Logout" onClick={logout}></Button>
          ) : (
            <>
              <Button text="Login" link="/login"></Button>
              <Button text="Sign Up" link="/sign-up"></Button>
            </>
          )}
          <Button text="Request for Help" link="#"></Button>
        </div>
      </main>
    </div>
    </Container>
  );
};

export default Home;
