import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, organizationService } from "services";
import { useRouter } from "next/router";
import dayjs from "dayjs";

type Inputs = {
  name: string;
  email: string;
  description: string;
  address: string;
  phone: string;
};

const defaultValues: any = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: ""
};

const FormEditOrg = ({ org }: any) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    const res = await organizationService.update(org._id, data)
    if (org.statusCode && org.message) {
      alertService.error(org.message)
    } else {
      router.push('/organizations/').then(() => {
        alertService.success('Organization was updated successful!')
      })
    }
    setLoading(false);
  };

  useEffect(() => {
    if (org && org._id) {
      reset({
        name: org.name,
        description: org.description,
        address: org.address,
        phone: org.phone,
        email: org.email
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

  return (
    <React.Fragment>
      <form name="form_org" onSubmit={handleSubmit(submit)}>
        <TextInput
          placeholder="Name"
          register={register("name", { required: true })}
        />
        {errors.name && errors.name.type === "required" && (
          <ErrorMessage>Please input name.</ErrorMessage>
        )}
        <textarea
          {...register("description", { required: true })}
          className={stylesComponent.input}
          placeholder="Updated Description"
        />
        {errors.description && errors.description.type === "required" && (
          <ErrorMessage>Please input description.</ErrorMessage>
        )}
        <TextInput
          placeholder="Address"
          register={register("address", { required: true })}
        />
        {errors.address && errors.address.type === "required" && (
          <ErrorMessage>Please input address.</ErrorMessage>
        )}
        <TextInput
          placeholder="Phone"
          register={register("phone", { required: true })}
        />
        {errors.phone && errors.phone.type === "required" && (
          <ErrorMessage>Please input phone.</ErrorMessage>
        )}
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
        <input disabled className={stylesComponent.input} value={dayjs(org.createdAt).format("MMMM DD, YYYY")} placeholder="Created On"/>
        <input disabled className={stylesComponent.input} value={dayjs(org.updatedAt).format("MMMM DD, YYYY")} placeholder="Last Updated"/>
        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormEditOrg;
