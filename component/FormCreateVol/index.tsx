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
  email: string;
  phone: string;
  password: string;
};

const defaultValues: any = {
  name: "",
  email: "",
  phone: "",
  password: ""
};

const FormCreateVol = () => {
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
      organizationId: organization.value,
      regionId: region.value
    }

    const res = await userService.create(params)
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/volunteers/').then(() => {
        alertService.success('Volunteer was created successful!')
      })
    }
    setLoading(false);
  };

  const [options, setOptions] = useState([])
  const [region, setRegion] = useState<any>();
  const [status, setStatus] = useState<any>(statuses[0]);
  const [role, setRole] = useState<any>(roles[0]);
  const [organization, setOrganization] = useState<any>();
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const res = await regionsService.list();
      const regions = res.items.map((region: any) => ({value: region._id, label: region.name}));
      setOptions(regions)
      setRegion(regions[0])
      const orgs = await organizationService.list();
      const optOrgs = orgs.items.map((org: any) => ({value: org._id, label: org.name}));
      setOrganizations(optOrgs)
      setOrganization(optOrgs[0])
    }

    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Select
          placeholder="Organization"
          options={organizations}
          value={organization}
          onChange={setOrganization}
        />
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
        <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          placeholder="Password"
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
        <div className={styles.grid}>
          <Button text="Create Organization" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormCreateVol;
