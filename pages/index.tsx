import type { NextPage } from 'next'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import Link from 'next/link'
import Button from 'component/Button';
import Head from 'component/Head';
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head/>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <Button text='Login' link='/login'></Button>
          <Button text='Sign Up' link='/sign-up'></Button>
          <Button text='Request for Help' link='#'></Button>
        </div>
      </main>
    </div>
  )
}

export default Home
