import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, organizationService, regionsService, userService } from "services";
import { useRouter } from "next/router";
import Select from "component/Select";

const statuses = [
  {label: 'Active', value: 1},
  {label: 'Inactive', value: 0}
]

const roles = [
  {label: 'Volunteer', value: 'Volunteer'},
  {label: 'OrgLead', value: 'OrgLead'},
  {label: 'Admin', value: 'Admin'}
]

type Inputs = {
  name: string;
  email: string;
  phone: string;
};

const defaultValues: any = {
  name: "",
  email: "",
  phone: ""
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
  const [region, setRegion] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [organization, setOrganization] = useState<any>();
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const res = await regionsService.list();
      const regions = res.items.map((region: any) => ({value: region._id, label: region.name}));
      setOptions(regions)
      // setRegion(regions[0])
      const orgs = await organizationService.list();
      const optOrgs = orgs.items.map((org: any) => ({value: org._id, label: org.name}));
      setOrganizations(optOrgs)
      // setOrganization(optOrgs[0])
    }

    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <form name="form-vol" onSubmit={handleSubmit(submit)}>
        <TextInput
          label="Name"
          placeholder="Volunteer Name"
          register={register("name", { required: true })}
        />
        {errors.name && errors.name.type === "required" && (
          <ErrorMessage>Please input name.</ErrorMessage>
        )}
        <TextInput
          label="Phone"
          placeholder="Volunteer Phone"
          register={register("phone", { required: true })}
        />
        {errors.phone && errors.phone.type === "required" && (
          <ErrorMessage>Please input phone.</ErrorMessage>
        )}
        <TextInput
          label="Email"
          placeholder="Volunteer Email"
          register={register("email", {
            required: true,
            pattern:
              /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
          })}
          type="email"
        />
        {errors.email && errors.email.type === "pattern" && (
          <ErrorMessage>Email must be valid.</ErrorMessage>
        )}
        {errors.email && errors.email.type === "required" && (
          <ErrorMessage>Please input email.</ErrorMessage>
        )}
        <Select
          label="Select City"
          placeholder="City"
          options={options}
          value={region}
          onChange={setRegion}
        />
        <Select
          label="Select Role"
          placeholder="Role"
          options={roles}
          value={role}
          onChange={setRole}
        />
        <Select
          label="Select Status"
          placeholder="Status"
          options={statuses}
          value={status}
          onChange={setStatus}
        />
        <Select
          label="Select Organization"
          placeholder="Organization"
          options={organizations}
          value={organization}
          onChange={setOrganization}
        />

        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormCreateVol;
