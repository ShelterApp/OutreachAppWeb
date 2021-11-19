import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, organizationService, regionsService, userService } from "services";
import { useRouter } from "next/router";
import Select from "component/Select";
import dayjs from "dayjs";

const statuses = [
  {label: 'active', value: 1},
  {label: 'inactive', value: 0}
]

const roles = [
  {label: 'Volunteer', value: 'Volunteer'},
  {label: 'OrgLead', value: 'OrgLead'}
]

type Inputs = {
  name: string;
  phone: string;
};

const defaultValues: any = {
  name: "",
  phone: ""
};

const FormEditVol = ({ vol }: any) => {
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
      status: status.value,
      userType: role.value,
      regionId: region.value
    }

    const res = await userService.updateUser(vol._id, params);
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/volunteers/').then(() => {
        alertService.success('Volunteer was updated successful!')
      })
    }
    setLoading(false);
  };

  const [options, setOptions] = useState([])
  const [region, setRegion] = useState<any>();
  const [status, setStatus] = useState<any>(statuses[0]);
  const [role, setRole] = useState<any>(roles[0]);

  useEffect(() => {
    const fetch = async () => {
      const res = await regionsService.list();
      const regions = res.items.map((region: any) => ({value: region._id, label: region.name}));
      setOptions(regions)
      setRegion(regions[0])

      if (vol && vol._id) {
        reset({
          name: vol.name,
          phone: vol.phone
        });

        setRole(roles.find(r => r.value === vol.userType))
        setStatus(statuses.find(r => r.value === vol.status))
        setRegion(regions.find((opt: any) => opt.value === vol.regionId._id));
      }
    }

    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vol]);

  return (
    <React.Fragment>
      <form name="form-vol" onSubmit={handleSubmit(submit)}>
        <TextInput
          placeholder="Name"
          register={register("name", { required: true })}
        />
        {errors.name && errors.name.type === "required" && (
          <ErrorMessage>Please input name.</ErrorMessage>
        )}
        <Select
          placeholder="Region"
          options={options}
          value={region}
          onChange={setRegion}
        />
        <Select
          placeholder="Role"
          options={roles}
          value={role}
          onChange={setRole}
        />
        <Select
          placeholder="Status"
          options={statuses}
          value={status}
          onChange={setStatus}
        />
        <TextInput
          placeholder="Phone"
          register={register("phone", { required: true })}
        />
        {errors.phone && errors.phone.type === "required" && (
          <ErrorMessage>Please input phone.</ErrorMessage>
        )}
        <input disabled className={stylesComponent.input} value={vol.email}/>
        <input disabled className={stylesComponent.input} value={dayjs(vol.createdAt).format("MMMM DD, YYYY")} placeholder="Created On"/>
        <input disabled className={stylesComponent.input} value={dayjs(vol.updatedAt).format("MMMM DD, YYYY")} placeholder="Last Updated"/>
        <div className={styles.grid}>
          <Button text="Create Organization" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormEditVol;
