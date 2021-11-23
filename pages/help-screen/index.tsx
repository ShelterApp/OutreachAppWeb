import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {  alertService, categoriesService,requestService } from "services";
import Container from '@mui/material/Container';
import stylesComponent from "component/Component.module.scss";

interface SelectType{
  value:string;
  label:string;
}
interface CategoryType{
  _id:string;
  name:string;
  parentId?:string;
}
type Inputs = {
  note: string;
  name: string;
  phone: string;
  email: string;
  password: string;
};

const HelpScreen: NextPage = () => {
  const router = useRouter();
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  
  const [options,setOptions]=useState([] as CategoryType[]);
  const [categories0, setCategories0] = useState([]as SelectType[]);
  const [categories1, setCategories1] = useState([] as SelectType[]);
  const [categories2, setCategories2] = useState([] as SelectType[]);
  const [parentCate, setParentCate] = useState<SelectType>();
  const [subCate, setSubCate] = useState<SelectType>();
  const [sizeCate, setSizeCate] = useState<SelectType>();
  // const [error,setError]=useState('');

  useEffect(() => {
    const fetch = async () => {
      const res = await categoriesService.list();
      const categories = res.items.filter((item: any) => !item.parentId)
        .map((item: any) => ({ value: item._id, label: item.name }));
      setCategories0(categories);
      setOptions(res.items);
    }

    fetch();
  }, [])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let item = {
      ...data,
      cate:{
        parentCateId:parentCate?.value,
        parentCateName:parentCate?.label||'',
        subCateId:subCate?.value,
        subCateName:subCate?.label||'',
        sizeCateId:sizeCate?.value,
        sizeCateName:sizeCate?.label||'',
      }
    };
    if(!item.cate.parentCateId) return;
    
    return requestService
      .create(item)
      .then((res) => {
        if (res.statusCode && res.statusCode == "400") {
          alertService.error(res.message)
          return;
        }else {
          alertService.success('Your request has been sent.')
          setParentCate({value:'',label:''});
          setSubCate({value:'',label:''});
          setSizeCate({value:'',label:''});
          setValue('note','');
          setValue('name','');
          setValue('email','');
          setValue('phone','');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onChangeCategory0 = (e: SelectType) => {
    setParentCate(e);
    setSubCate({value:'',label:''});
    setSizeCate({value:'',label:''});
    setCategories1(options.filter((item:CategoryType)=>item.parentId == e.value)
    .map((item: CategoryType) => ({ value: item._id, label: item.name })));   
    setCategories2([]); 
  };

  const onChangeCategory1= (e: SelectType) => {
    setSubCate(e);
    setSizeCate({value:'',label:''});
    setCategories2(options.filter((item:CategoryType)=>item.parentId == e.value)
    .map((item: CategoryType) => ({ value: item._id, label: item.name })));    
  }

  const onChangeCategory2= (e: SelectType) => {
    setSizeCate(e);
  }

  return (
    <Container maxWidth="sm">
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.titleName}>OutreachApp</div>
          <div className={styles.grid}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <div className={styles.grid}>
                <TextInput
                  placeholder="Your Name"
                  register={register("name", { required: true })}
                />
                {errors.name && errors.name.type === "required" && (
                  <ErrorMessage>Please input name.</ErrorMessage>
                )}
                <TextInput
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
                  placeholder="Phone Number"
                  register={register("phone", { required: true,minLength:8 })}
                />
                {errors.phone && errors.phone.type === "required" && (
                  <ErrorMessage>Please input phone.</ErrorMessage>
                )}
                <Select
                  placeholder="I'm Locking For"
                  options={categories0}
                  value={parentCate}
                  onChange={(e) => onChangeCategory0(e)}
                />
                 {!!categories1.length&&<Select
                  placeholder="Select Category"
                  options={categories1}
                  value={subCate}
                  onChange={(e) => onChangeCategory1(e)}
                />  } 
                { !!categories2.length &&<Select
                  placeholder="Selecr Size"
                  options={categories2}
                  value={sizeCate}
                  onChange={(e) => onChangeCategory2(e)}
                />  }  
              </div>
              <textarea
                {...register("note",{required:true})}
                className={stylesComponent.input}
                placeholder="Any other details you would like to add"
              />
               {errors.note && errors.note.type === "required" && (
                <ErrorMessage>Please input description.</ErrorMessage>
              )}
              <div className={styles.grid}>
                <Button
                  text="Request for Help"
                  type="submit"
                  onClick={() => handleSubmit(onSubmit)}
                ></Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </Container>
  );
};

export default HelpScreen;
