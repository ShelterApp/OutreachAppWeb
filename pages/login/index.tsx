import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import Button from "component/Button";
import Link from "next/link";
import { userService } from "services";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data: { email: any; password: any; }) => {
    return userService
      .login(data.email, data.password)
      .then((res) => {
        if (res.statusCode && res.statusCode == "401") {
          setMessage(res.message);
          return;
        }
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl?.toString() || "/";
        router.push(returnUrl);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [message, setMessage] = useState("");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <div className={stylesComponent.container}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("email", {
                  required: true,
                  pattern:
                    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                })}
                className={stylesComponent.input}
                placeholder="Email or Phone Number"
                type="email"
                autoComplete="false"
              />
              {errors.email && errors.email.type === "pattern" && (
                <ErrorMessage>Email must be valid.</ErrorMessage>
              )}
              {errors.email && errors.email.type === "required" && (
                <ErrorMessage>Please input email.</ErrorMessage>
              )}
              <input
                {...register("password", { required: true, minLength: 6 })}
                type="password"
                placeholder="Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
              {errors.password && errors.password.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.password && errors.password.type === "required" && (
                <ErrorMessage>Please input password.</ErrorMessage>
              )}
              {message && <ErrorMessage>{message}</ErrorMessage>}
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
        </div>
      </main>
    </div>
  );
};

export default Login;
