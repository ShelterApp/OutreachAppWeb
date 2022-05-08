import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService,regionsService } from "services";
import Container from '@mui/material/Container';

type Inputs = {
  orgCode: string;
  name: string;
  email: string;
  password: string;
};

const SignUp: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [options, setOptions] = useState([])
  const [phoneNumber, setPhone]= useState<any>('');

  useEffect(() => {
    const fetch = async () => {
      const res = await regionsService.list();
      const regions = res.items.map((region: any) => ({value: region._id, label: region.name}));
      setOptions(regions)
    }

    fetch();
  }, [])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const user = {
      ...data,
      regionId: region ? region.value : "",
      phone:phoneNumber,
    };

    return userService
      .register(user)
      .then((res) => {
        if (res.statusCode && res.statusCode == "400") {
          if(res.message=='orgcode_invalid')
          res.message='Please type correct verification code';
          alertService.error(res.message)
          return;
        }
        alertService.success('Sign up successful. Please check your email.')
        router.push("/login");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const [region, setRegion] = useState<any>();

  const onChangeCity = (e: any) => {
    setRegion(e);
  };

  const formatPhoneNumber=(value:string)=> {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;
  
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,  6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  return (
    <Container maxWidth="sm">
      <div className={styles.container}>
        <main className={styles.main} style={{height: 'unset', paddingTop: 20}}>
          <div className={styles.titleName}>OutreachApp</div>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", paddingTop: 20 }}>
            <Select
              label="Select City"
              placeholder="Choose Your City"
              options={options}
              value={region}
              onChange={(e) => onChangeCity(e)}
            />
            <TextInput
              label="Verification Code"
              placeholder="Verification Code"
              register={register("orgCode", { required: true })}
            />
            {errors.orgCode && errors.orgCode.type === "required" && (
              <ErrorMessage>Please input orgCode.</ErrorMessage>
            )}
            <TextInput
              label="Your Name"
              placeholder="Your Name"
              register={register("name", { required: true })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMessage>Please input name.</ErrorMessage>
            )}
            <TextInput
              label="Phone Number"
              placeholder="Phone Number"
              value={phoneNumber}
          onChange={(e:string)=> setPhone(formatPhoneNumber(e.target.value))}
            />
           {!phoneNumber.length && (
          <ErrorMessage>Please input phone.</ErrorMessage>
        )}
            <TextInput
              label="Email"
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
              label="Password"
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
            <div style={{textAlign: 'center'}}>
              <Button
                text="Sign Up"
                type="submit"
                onClick={() => handleSubmit(onSubmit)}
              ></Button>
            </div>
            <div className={styles.textNormal}>
              { "If you don't have a verification code, Please email us at " }
              <a href="mailto: shelterappinfo@gmail.com">
                {" "}
                shelterappinfo@gmail.com{" "}
              </a>
            </div>
          </form>
        </main>
      </div>
    </Container>
  );
};

export default SignUp;
