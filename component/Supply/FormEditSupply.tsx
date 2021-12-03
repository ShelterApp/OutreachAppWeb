import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, suppliesService } from "services";
import { useRouter } from "next/router";
import Select from "component/Select";
import dayjs from "dayjs";

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

const FormEditSupply = ({ record }: any) => {
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

    const res = await suppliesService.update(record._id, params);
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/supplies/').then(() => {
        alertService.success('Supply was updated successful!')
      })
    }
    setLoading(false);
  };

  const [status, setStatus] = useState<any>(statuses[0]);

  useEffect(() => {
    const fetch = async () => {
      if (record && record._id) {
        reset({
          name: record.name,
          description: record.description
        });
        setStatus(statuses.find(r => r.value === record.status))
      }
    }

    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  return (
    <React.Fragment>
      <form name="form-record" onSubmit={handleSubmit(submit)}>
        <TextInput
          label="Name"
          placeholder="Name"
          register={register("name", { required: true })}
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
        <label className={stylesComponent.label}>Created On</label>
        <input disabled className={stylesComponent.input} value={dayjs(record.createdAt).format("MMMM DD, YYYY")} placeholder="Created On"/>
        <label className={stylesComponent.label}>Last Updated</label>
        <input disabled className={stylesComponent.input} value={dayjs(record.updatedAt).format("MMMM DD, YYYY")} placeholder="Last Updated"/>
        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormEditSupply;
