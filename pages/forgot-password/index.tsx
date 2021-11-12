import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import stylesComponent from "component/Component.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";
import { userService,  } from "services";

const options = [
  { value: "618563c781a92408a00bd1aa", label: "Seattle" },
  { value: "618562de8f4e4f313fdc8111", label: "San Jose" },
];

type Inputs = {
  orgCode: string;
  name: string;
  phone: string;
  email: string;
  password: string;
};

const ForgotPassword: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let user = {
      ...data,
    }
    console.log(user);
  };
  const [message, setMessage] = useState('');

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>
            <div className={styles.grid}>
            <TextInput
              type="email"
              register = {register("email", {
                required: true,
                pattern:
                  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
              })}
              placeholder="Enter email or phone"
            />
            </div>
            {errors.email && errors.email.type === "pattern" && (
              <ErrorMessage>Email must be valid.</ErrorMessage>
            )}
            {errors.email && errors.email.type === "required" && (
              <ErrorMessage>Please input email.</ErrorMessage>
            )}
            {
              message && <ErrorMessage>{message}</ErrorMessage>
            }
             <div className={styles.grid}>
                <Button text="Reset" type='submit'></Button>
              </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
