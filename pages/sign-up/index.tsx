import type { NextPage } from "next";
import Head from 'component/Head';

import styles from "styles/Home.module.css";
import TextInput from "component/TextInput";
import Button from "component/Button";
import Select from "component/Select";
const options = [
    { value: "618563c781a92408a00bd1aa", label: "Seattle" },
    { value: "618562de8f4e4f313fdc8111", label: "San Jose" },
];

const SignUp: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head/>
            <main className={styles.main}>
                <div className={styles.titleName}>OutreachApp</div>
                <div className={styles.grid}>
                    <Select placeholder="Choose Your City" options={options} />
                    <TextInput placeholder="Verification Code" />
                    <TextInput placeholder="Your Name" />
                    <TextInput placeholder="Phone Number" />
                    <TextInput placeholder="Email Address" />
                    <TextInput placeholder="Password" />
                    <Button text="Sign Up" link="/SignUp" />
                </div>
            </main>
        </div>
    );
};

export default SignUp;
