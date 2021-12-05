import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
// import stylesComponent from "component/Component.module.scss";
import Button from "component/Button";
import Link from "next/link";
import { alertService, userService } from "services";
import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import TextInput from "component/TextInput";
import Container from '@mui/material/Container';

type Inputs = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data: { email: any; password: any; }) => {
    return userService
      .login(data.email, data.password)
      .then((res) => {
        if (res.statusCode && res.statusCode == "401") {
          alertService.error(res.message)
          return;
        }
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl?.toString() || "/";
        router.push(returnUrl);
      })
      .catch(() => {
        // console.log(e);
      });
  };

  return (
    <Container maxWidth="sm">
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <TextInput
                label="Email"
                placeholder="Email or Phone Number"
                type="email"
                register={register("email", {
                  required: true,
                  pattern:
                    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                })}
              />
              {errors.email && errors.email.type === "pattern" && (
                <ErrorMessage>Email must be valid.</ErrorMessage>
              )}
              {errors.email && errors.email.type === "required" && (
                <ErrorMessage>Please input email.</ErrorMessage>
              )}
              <TextInput
                label="Password"
                placeholder="Password"
                type="password"
                register={register("password", { required: true, minLength: 6 })}
              />
              {errors.password && errors.password.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.password && errors.password.type === "required" && (
                <ErrorMessage>Please input password.</ErrorMessage>
              )}
              <div className={styles.grid}>
                <Button text="Login" type="submit"></Button>
              </div>
              <div className={styles.forgotContainer}>
                <Link href="/forgot-password" passHref>
                  <div>Forgot Password?</div>
                </Link>
                <Link href="/sign-up" passHref>
                  <div>Sign Up</div>
                </Link>
              </div>
            </form>
        </div>
      </main>
    </div>
</Container>
  );
};

export default Login;
