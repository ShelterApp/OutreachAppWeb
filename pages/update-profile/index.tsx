import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import { userService, alertService, regionsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import {formatPhoneNumber} from 'helpers/function';

type Inputs = {
  name: string;
  phone: string;
  email: string;
};

const UpdateProfile: NextPage = () => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    const user = {
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
  const [phoneNumber, setPhone]= useState<any>('');

  useEffect(() => {
    const fetch = async () => {
      const res = await regionsService.list();
      const regions = res.items.map((region: any) => ({value: region._id, label: region.name}));
      setOptions(regions)
      if (userService.userValue) {
        const user = userService.userValue.user;
        reset({
          name: user.name,
          phone: user.phone,
          email: user.email,
        });
        setPhone(user.phone);
        setRegion(regions.find((opt: any) => opt.label === user.regionId.name));
      }
    }

    fetch();
  }, []);

  return (
    <main className={styles.mainTop}>
      <Header title='Update Profile' back='/' />
      <Container maxWidth="sm">
      <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
              <TextInput
                label="Name"
                placeholder="Update My Name"
                register={register("name", { required: true })}
              />
              {errors.name && errors.name.type === "required" && (
                <ErrorMessage>Please input name.</ErrorMessage>
              )}
              <Select
                label="Select City"
                placeholder="Update City"
                options={options}
                value={region}
                onChange={setRegion}
              />
            </div>
            <TextInput
              label="Phone"
              placeholder="Volunteer Phone"
              register={register("phone", { 
                required: true,
                onChange:(e)=>setValue('phone',formatPhoneNumber(e.target.value)),
                minLength:14,
            })}
               />
              {errors.phone && errors.phone.type === "required" &&(
                <ErrorMessage>Please input phone.</ErrorMessage>
              )}
              {errors.phone && errors.phone.type === "minLength" &&(
                <ErrorMessage>Please input valid phone.</ErrorMessage>
              )}
            <TextInput
              label="Email"
              type="email"
              readOnly={true}
              register={register("email", {
                required: true,
                pattern:
                  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
              })}
              placeholder="Update Email"
            />
            {errors.email && errors.email.type === "pattern" && (
              <ErrorMessage>Email must be valid.</ErrorMessage>
            )}
            {errors.email && errors.email.type === "required" && (
              <ErrorMessage>Please input email.</ErrorMessage>
            )}
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

export default UpdateProfile;
