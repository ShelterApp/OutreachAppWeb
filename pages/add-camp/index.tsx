import type { NextPage } from "next";
import React from 'react';
import { useState } from "react";
import AddNewCamp from "component/AddCamp/AddNewCamp";
import CampDetails from "component/AddCamp/CampDetails";
import UnhousedInfo from "component/AddCamp/UnhousedInfo";
import Supplies from "component/AddCamp/Supplies";
import { alertService, campsService } from "services";
import { useRouter } from "next/router";

const AddCamp: NextPage = () => {
  const [step, setStep] = useState<number>(1);

  const onSubmit = (i: number) => {
    setStep(i)
  }

  const [campDetails, setCampDetails] = useState<any>({
    name: '',
    description: '',
    numOfPeople: 1,
    numOfPet: 1
  })

  const onSubmitCamp = (form: any) => {
    console.log(form)
    setStep(3)
    setCampDetails(form)
  }

  const previousBack = (i: number) => {
    setStep(i)
  }

  const [people, setPeople] = useState<any[]>([])

  const onSubmitUnhousedInfo = (obj: any[]) => {
    setStep(4)
  }

  const _center = {
    lat: 32.965557,
    lng: -96.71583
  };
  const [center, setCenter] = useState(_center);
  const [dropSupplies, setDropSupplies] = useState<any[]>([]);
  const [requestSupplies, setRequestSupplies] = useState<any[]>([]);

  const createCamp = async () => {
    const router = useRouter();
    let data = {
      ...campDetails,
      people: people,
      location: {
        type: 'Point',
        'coordinates': [
          center.lng, center.lat
        ]
      },
      requestSupplies: requestSupplies,
      dropSupplies: dropSupplies,
      type: 1,
      status: 1
    }

    const res = await campsService.create(data);
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/').then(() => {
        alertService.success('Camp was created successful!')
      })
    }
  }

  return (
    <>
      {
        step === 1 && <AddNewCamp center={center} setCenter={setCenter} onSubmit={onSubmit}/>
      }
      {
        step === 2 && <CampDetails defaultValues={campDetails} previousBack={previousBack} onSubmit={onSubmitCamp}/>
      }
      {
        step === 3 && <UnhousedInfo people={people} setPeople={setPeople} previousBack={previousBack} onSubmit={onSubmitUnhousedInfo}/>
      }
      {
        step === 4 && <Supplies dropSupplies={dropSupplies} requestSupplies={requestSupplies} setDropSupplies={setDropSupplies} setRequestSupplies={setRequestSupplies} previousBack={previousBack} onSubmit={createCamp}/>
      }
    </>
  );
};

export default AddCamp;
