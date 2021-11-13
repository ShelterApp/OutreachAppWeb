import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import SuccessMessage from "component/SuccessMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";

type Inputs = {
  email: string;
};

const ForgotPassword: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    const res = await userService.forgotPassword(data);
    if (res && res.message) {
      setMessage(res.message)
    } else {
      setMessage('success')
    }
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
              message && (
                message === 'success' ?
                <SuccessMessage>Please check your email to reset password.</SuccessMessage> :
                <ErrorMessage>{message}</ErrorMessage>
              )
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
