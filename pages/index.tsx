import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import Link from 'next/link'
import Button from 'component/Button';
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>OutreachApp</title>
        <meta name="description" content="Generated by create OutreachApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <Button text='Login' link='/login'></Button>
          <Button text='Sign Up' link='#'></Button>
          <Button text='Request for Help' link='#'></Button>
        </div>
      </main>
    </div>
  )
}

export default Home
