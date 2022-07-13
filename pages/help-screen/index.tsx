import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import {
  alertService,
  categoriesService,
  requestService,
  userService,
} from "services";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import stylesComponent from "component/Component.module.scss";
import {formatPhoneNumber} from 'helpers/function';

interface SelectType {
  value: string;
  label: string;
}
interface CategoryType {
  _id: string;
  name: string;
  parentId?: string;
}
type Inputs = {
  note: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  location: object;
  createdBy: string;
};

const HelpScreen: NextPage = () => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [options, setOptions] = useState([] as CategoryType[]);
  const [categories0, setCategories0] = useState([] as SelectType[]);
  const [categories1, setCategories1] = useState([] as SelectType[]);
  const [categories2, setCategories2] = useState([] as SelectType[]);
  const [parentCate, setParentCate] = useState<SelectType>();
  const [subCate, setSubCate] = useState<SelectType>();
  const [sizeCate, setSizeCate] = useState<SelectType>();
  const [checked, setChecked] = useState<boolean>(false);
  const [location, setLocation] = useState([] as number[]);

  useEffect(() => {
    const fetch = async () => {
      const res = await categoriesService.list();
      const categories = res.items
        .filter((item: any) => !item.parentId)
        .map((item: any) => ({ value: item._id, label: item.name }));
      setCategories0(categories);
      setOptions(res.items);
    };
    navigator.geolocation.getCurrentPosition((position) => {
      if (position.coords)
        setLocation([position.coords.longitude, position.coords.latitude]);
    });

    fetch();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const item = {
        ...data,
        cate: {
          parentCateId: parentCate?.value,
          parentCateName: parentCate?.label || "",
          subCateId: subCate?.value,
          subCateName: subCate?.label || null,
          sizeCateId: sizeCate?.value || null,
          sizeCateName: sizeCate?.label || null,
        },
      };
      const user = userService && userService.userValue? userService.userValue.user:null;
    if (user && user._id) item.createdBy = user._id;
    if (!item.cate.parentCateId) {
      return alertService.error("Error. Please check again");
    }
    if (checked && location.length) {
      item.location = { type: "Point", coordinates: location };
    } else if (checked && !location.length) {
      alertService.error("Please turn on location.");
      navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords)
          setLocation([position.coords.longitude, position.coords.latitude]);
        item.location = { type: "Point", coordinates: location };
      });
      return;
    }
    sendRequest(item);
  };

  const sendRequest = async (item: Inputs) => {
    return requestService
      .create(item)
      .then((res) => {
        if (res._id) {
          alertService.success("Your request has been sent.");
          setParentCate({ value: "", label: "" });
          setSubCate({ value: "", label: "" });
          setSizeCate({ value: "", label: "" });
          setValue("note", "");
          setValue("name", "");
          setValue("email", "");
          setValue("phone", "");

        } else {
          alertService.error(res.message);
          return;
        }
      })
      .catch(() => {
        // console.log(e);
      });
  };

  const onChangeCategory0 = (e: SelectType) => {
    setParentCate(e);
    setSubCate({ value: "", label: "" });
    setSizeCate({ value: "", label: "" });
    setCategories1(
      options
        .filter((item: CategoryType) => item.parentId == e.value)
        .map((item: CategoryType) => ({
          value: item._id,
          label: item.name,
        }))
    );
    setCategories2([]);
  };

  const onChangeCategory1 = (e: SelectType) => {
    setSubCate(e);
    setSizeCate({ value: "", label: "" });
    setCategories2(
      options
        .filter((item: CategoryType) => item.parentId == e.value)
        .map((item: CategoryType) => ({
          value: item._id,
          label: item.name,
        }))
    );
  };

  const onChangeCategory2 = (e: SelectType) => {
    setSizeCate(e);
  };

  return (
    <Container maxWidth="sm">
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.titleName}>OutreachApp</div>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", paddingTop: 20 }}>
            <TextInput
              label="Name"
              placeholder="Your Name"
              register={register("name", {
                required: true,
              })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMessage>Please input name.</ErrorMessage>
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
              label="Phone"
              placeholder="Phone Number"
              register={register("phone", { 
                // required: true,
                onChange:(e)=>setValue('phone',formatPhoneNumber(e.target.value)),
                minLength:14,
            })}
               />
              {/* {errors.phone && errors.phone.type === "required" &&(
                <ErrorMessage>Please input phone.</ErrorMessage>
              )} */}
              {errors.phone && errors.phone.type === "minLength" &&(
                <ErrorMessage>Please input valid phone.</ErrorMessage>
              )}
           
            <Select
              label="I'm Looking For"
              placeholder="I'm Looking For"
              options={categories0}
              value={parentCate}
              onChange={(e) => onChangeCategory0(e)}
            />
            {!!categories1.length && (
              <Select
                label="Select Category"
                placeholder="Select Category"
                options={categories1}
                value={subCate}
                onChange={(e) => onChangeCategory1(e)}
              />
            )}
            {!!categories2.length && (
              <Select
                label="Select Size"
                placeholder="Selecr Size"
                options={categories2}
                value={sizeCate}
                onChange={(e) => onChangeCategory2(e)}
              />
            )}
            <label className={stylesComponent.label}>Note</label>
            <textarea
              {...register("note")}
              className={stylesComponent.input}
              rows={5}
              placeholder="Any other details you would like to add"
            />
            {/* {errors.note && errors.note.type === "required" && (
              <ErrorMessage>Please input description.</ErrorMessage>
            )} */}

            {!!location.length &&<FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label="Add your location" />}
            <div style= {{ textAlign: 'center'}}>
              <Button
                text="Request for Help"
                type="submit"
                onClick={() => handleSubmit(onSubmit)}
              ></Button>
            </div>
          </form>
        </main>
      </div>
    </Container>
  );
};

export default HelpScreen;
