import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService } from "services";

const options = [
  { value: "618563c781a92408a00bd1aa", label: "Seattle" },
  { value: "618562de8f4e4f313fdc8111", label: "San Jose" },
];

type Inputs = {
  name: string;
  phone: string;
  email: string;
};

const UpdateProfile: NextPage = () => {
  const router = useRouter();
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
  const [region, setRegion] = useState<any>(options[0]);

  useEffect(() => {
    if (!!userService.userValue) {
      const user = userService.userValue.user;

      reset({
        name: user.name,
        phone: user.phone,
        email: user.email,
      });
      setRegion(options.find((opt) => opt.value === user.regionId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
              <TextInput
                placeholder="Update My Name"
                register={register("name", { required: true })}
              />
              {errors.name && errors.name.type === "required" && (
                <ErrorMessage>Please input name.</ErrorMessage>
              )}
              <Select
                placeholder="Update City"
                options={options}
                value={region}
                onChange={setRegion}
              />
            </div>
            <TextInput
              placeholder="Update Phone"
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
      </main>
    </div>
  );
};

export default UpdateProfile;
