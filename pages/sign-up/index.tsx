import type { NextPage } from "next";
import Head from "component/Head";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import stylesComponent from "component/Component.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";

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

const SignUp: NextPage = () => {
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
      regionId: region ? region.value : "",
    };
    console.log(user);

    return userService
      .register(user)
      .then((res) => {
        if (res.statusCode && res.statusCode == "400") {
          setMessage(res.message);
          return;
        }

        router.push("/login");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const [region, setRegion] = useState(options[0]);
  const [message, setMessage] = useState("");

  const onChangeCity = (e: any) => {
    setRegion(e);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
              <Select
                placeholder="Choose Your City"
                options={options}
                value={region}
                onChange={(e) => onChangeCity(e)}
              />
            </div>
            <TextInput
              placeholder="Verification Code"
              register={register("orgCode", { required: true })}
            />
            {errors.orgCode && errors.orgCode.type === "required" && (
              <ErrorMessage>Please input orgCode.</ErrorMessage>
            )}
            <TextInput
              placeholder="Your Name"
              register={register("name", { required: true })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMessage>Please input name.</ErrorMessage>
            )}
            <TextInput
              placeholder="Phone Number"
              register={register("phone", { required: true })}
            />
            {errors.phone && errors.phone.type === "required" && (
              <ErrorMessage>Please input phone.</ErrorMessage>
            )}
            <TextInput
              type="email"
              register={register("email", {
                required: true,
                pattern:
                  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
              })}
              placeholder="Email Address"
            />
            {errors.email && errors.email.type === "pattern" && (
              <ErrorMessage>Email must be valid.</ErrorMessage>
            )}
            {errors.email && errors.email.type === "required" && (
              <ErrorMessage>Please input email.</ErrorMessage>
            )}
            <TextInput
              placeholder="Password"
              register={register("password", { required: true, minLength: 6 })}
              type="password"
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
              <Button
                text="Sign Up"
                type="submit"
                onClick={() => handleSubmit(onSubmit)}
              ></Button>
            </div>
            <div className={styles.textNormal}>
              If you don't have a verification code or don't see your
              Orgaization name listed, Please email us at
              <a href="mailto: shelterappinfo@gmail.com">
                {" "}
                shelterappinfo@gmail.com{" "}
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
