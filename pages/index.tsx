import type { NextPage } from 'next'
import { useState, useEffect } from 'react';
import styles from 'styles/Home.module.css'
import Button from 'component/Button';
import { userService } from 'services';

const Home: NextPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe(x => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  const logout = () => {
    userService.logout();
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          {
            user ?
            <Button text='Logout' onClick={logout}></Button> :
            <>
              <Button text='Login' link='/login'></Button>
              <Button text='Sign Up' link='/sign-up'></Button>
            </>
          }
          <Button text='Request for Help' link='#'></Button>
        </div>
      </main>
    </div>
  )
}

export default Home
