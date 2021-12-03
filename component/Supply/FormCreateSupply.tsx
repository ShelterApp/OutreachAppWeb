import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, suppliesService } from "services";
import { useRouter } from "next/router";
import Select from "component/Select";
import stylesComponent from "component/Component.module.scss";

type Inputs = {
  name: string;
  description: string;
};

const defaultValues: any = {
  name: "",
  description: ""
};

const statuses = [
  {label: 'Active', value: 1},
  {label: 'Inactive', value: 0}
]

const FormCreateSupply = () => {
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

    const params = {
      ...data,
      status: status.value
    }

    const res = await suppliesService.create(params)
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/supplies/').then(() => {
        alertService.success('Supply was created successful!')
      })
    }
    setLoading(false);
  };

  const [status, setStatus] = useState<any>(statuses[0]);

  return (
    <React.Fragment>
      <form name="form-vol" onSubmit={handleSubmit(submit)}>
        <TextInput
          label="Name"
          type="string"
          register = {register("name", {
            required: true,
          })}
        />
        {errors.name && errors.name.type === "required" && (
          <ErrorMessage>Please input name.</ErrorMessage>
        )}
        <label className={stylesComponent.label}>Description</label>
        <textarea
          {...register("description", { required: true })}
          className={stylesComponent.input}
          placeholder="Description"
        />
        {errors.description && errors.description.type === "required" && (
          <ErrorMessage>Please input description.</ErrorMessage>
        )}
        <Select
          label="Select Status"
          placeholder="Status"
          options={statuses}
          value={status}
          onChange={setStatus}
        />
        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormCreateSupply;
