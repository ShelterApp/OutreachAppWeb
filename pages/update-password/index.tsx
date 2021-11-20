import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService, regionsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import stylesComponent from "component/Component.module.scss";

type Inputs = {
  name: string;
  phone: string;
  email: string;
};

const UpdatePassword: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    let user = {
      ...data,
      regionId: region ? region.value : "",
    };
    const res = await userService.update(user);
    if (res && res._id) {
      alertService.success("Your profile was updated successful.");
    } else {
      alertService.error("Have something wrong");
    }
  };

  const [options, setOptions] = useState([])
  const [region, setRegion] = useState<any>();

  useEffect(() => {
    const fetch = async () => {
      const res = await regionsService.list();
      const regions = res.items.map((region: any) => ({value: region._id, label: region.name}));
      setOptions(regions)

      if (!!userService.userValue) {
        const user = userService.userValue.user;

        reset({
          name: user.name,
          phone: user.phone,
          email: user.email,
        });
        setRegion(regions.find((opt: any) => opt.value === user.regionId));
      }
    }

    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.mainTop}>
      <Header title='Update Password' back='/' />
      <Container maxWidth="sm">
      <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
            <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          placeholder="Current Password"
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
         <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          placeholder="New Password"
          className={stylesComponent.input}
          autoComplete="false"
        />
         <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          placeholder="Confirm Password"
          className={stylesComponent.input}
          autoComplete="false"
        />
            </div>
            <div className={styles.grid}>
              <Button
                text="Save"
                type="submit"
                onClick={() => handleSubmit(onSubmit)}
              ></Button>
            </div>
          </form>
        </div>
        </Container>
    </main>
  );
};

export default UpdatePassword;
