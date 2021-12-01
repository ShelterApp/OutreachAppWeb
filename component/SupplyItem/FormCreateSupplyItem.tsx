import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, organizationService, suppliesService, supplyItemsService } from "services";
import { useRouter } from "next/router";
import Select from "component/Select";

type Inputs = {
  qty: number;
};

const defaultValues: any = {
  qty: 0
};

const FormCreateSupplyItem = () => {
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
      qty: parseInt(data.qty),
      organizationId: organization.value,
      supplyId: supply.value
    }

    const res = await supplyItemsService.create(params)
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/supply-items/').then(() => {
        alertService.success('Supply Item was created successful!')
      })
    }
    setLoading(false);
  };

  const [supply, setSupply] = useState<any>();
  const [supplies, setsupplies] = useState([])
  const [organization, setOrganization] = useState<any>();
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const spls = await suppliesService.list();
      const optSpls = spls.items.map((org: any) => ({value: org._id, label: org.name}));
      setsupplies(optSpls)
      // setSupply(optSpls[0])
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
        <Select
          label="Select Organization"
          placeholder="Organization"
          options={organizations}
          value={organization}
          onChange={setOrganization}
        />
        <Select
          label="Select Supply"
          placeholder="Supply"
          options={supplies}
          value={supply}
          onChange={setSupply}
        />
        <TextInput
          label="Quantity"
          type="number"
          register = {register("qty", {
            required: true,
            min: 0
          })}
        />
        {errors.qty && errors.qty.type === "min" && (
          <ErrorMessage>Please input valid quantity.</ErrorMessage>
        )}
        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormCreateSupplyItem;
