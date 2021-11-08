import type { NextPage } from "next";
import Head from 'component/Head';
import styles from "styles/Home.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.css";
import Button from "@mui/material/Button";
import { userService, alertService } from "services";
import { useRouter } from "next/router";

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
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    console.log(userService)

    return userService
      .login(data.email, data.password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch(alertService.error);
  };

  return (
    <div className={styles.container}>
      <Head/>
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
              />
              {errors.password && errors.password.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.password && errors.password.type === "required" && (
                <ErrorMessage>Please input password.</ErrorMessage>
              )}
              <Button type="submit" variant="outlined" size="large" 
              className={stylesComponent.card}
              style={{textTransform:'none', borderRadius:50, backgroundColor:'#5952ff', color:'white'}}>
                Login
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
