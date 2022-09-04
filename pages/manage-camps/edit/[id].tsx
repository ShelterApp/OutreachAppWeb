import type { NextPage } from "next";
import React, { useEffect, useState } from 'react';
import AddNewCamp from "component/AddCamp/AddNewCamp";
import CampDetails from "component/AddCamp/CampDetails";
import UnhousedInfo from "component/AddCamp/UnhousedInfo";
import { alertService, campsService } from "services";
import { useRouter } from "next/router";
import { CampDetailsProps, PeopleProps } from "common/interface";
import { getLocationAPIMap } from "services/map.service";

const initCampDetails: CampDetailsProps = {
  description: "",
  name: "",
  numOfPeople: 1,
  numOfPet: 0,
  type: 1,
  address: "",
  status: 1,
  country:'US',
  postcode: '',
  county:'',
  state:'',
  city:'',
}

const initPeople: PeopleProps = {
  age: 18,
  disabled: 'No',
  name: '',
  gender: 'Male',
  race: '',
  unhouseSince: '',
  homeless: 'No'
}

const EditCamp: NextPage = () => {
  const router = useRouter();
  const [record, setRecord] = useState();
  const { id } = router.query;

  useEffect(() => {
    const fetch = async () => {
      const res = await campsService.get(id);
      if (res && res._id) {
        setRecord(res);
        setCampDetails({
          description: res.description,
          name: res.name,
          numOfPeople: res.numOfPeople,
          numOfPet: res.numOfPet,
          type: res.type,
          address: res.address,
          status: res.status,
          country:res.country,
          county:res.county,
          city:res.city,
          state:res.state,
          postcode:res.postcode,
        })
        setCenter({
          lat: res.location.coordinates[1],
          lng: res.location.coordinates[0]
        })

        const _people = res.people.map((o: any) => ({
          age: o.age,
          disabled: o.disabled,
          name: o.name,
          gender: o.gender,
          race: o.race,
          unhouseSince: o.homeless === 'Yes' ? o.unhouseSince : '',
          homeless: o.homeless
        }))
        setPeople(_people)
        return;
      }
    }

    fetch()
  }, [id])

  const [step, setStep] = useState<number>(1);

  const onSubmit = async (i: number) => {
    const locationMap = await getLocationAPIMap(center);
    let address = "",country='',state='',postcode='',county='',city='';
    if (locationMap.results && locationMap.results[0]) {
      const dataAddress=locationMap.results[0].address_components;
      dataAddress.forEach((element:any) => {
        if(!campDetails.country &&  element.types.includes('country')) country=element.short_name;
        if(!campDetails.state && element.types.includes('administrative_area_level_1')) state=element.long_name;
        if(!campDetails.county && element.types.includes('administrative_area_level_2')) county=element.long_name;
        if(!campDetails.address && element.types.includes('route')) address=element.long_name;
        if(!campDetails.city && element.types.includes('locality')) city=element.long_name;
        if(!campDetails.postcode && element.types.includes('postal_code')) postcode = element.short_name ;
      });
      // locationMap.results[1].address_components.forEach((element:any) => {
      //   if(element.types.includes('postal_code')) postcode = parseInt(element.short_name);
      // })
    }
    
    setCampDetails({
      ...campDetails,
       address:campDetails.address || address,
       state:campDetails.state||state ,
       postcode:campDetails.postcode ||postcode ,
       city:campDetails.city ||city ,
       county:campDetails.county ||county 
       ,country:campDetails.country ||country ,
    })
    setStep(i)
  }

  const [campDetails, setCampDetails] = useState<CampDetailsProps>(initCampDetails)

  const onSubmitCamp = (form: any) => {
    setCampDetails({...form})

    if (form.numOfPeople == 0) {
      setPeople([])
      createCamp([], form)
    } else {
      if(people.length > form.numOfPeople) {
        setPeople([...people.slice(0, form.numOfPeople)]);
      } else {
        const _i = form.numOfPeople - people.length;
        const newPeople = [...Array(_i).fill(0).map(() => ({...initPeople}))];
        setPeople([...people, ...newPeople]);
      }
      setStep(3)
    }
  }

  const previousBack = (i: number) => {
    setStep(i)
  }

  const [people, setPeople] = useState<PeopleProps[]>([])

  const onSubmitUnhousedInfo = (list: PeopleProps[]) => {
    setPeople([...list]);
    createCamp(list, campDetails);
  }

  const _center = {
    lat: 32.965557,
    lng: -96.71583
  };
  const [center, setCenter] = useState(_center);
  const [zoom, setZoom] = useState(15);

  const createCamp = async (list: PeopleProps[], camp: any) => {
    // const locationMap = await getLocationAPIMap(center);
    // const address = "";
    // if (locationMap.results && locationMap.results[0]) {
    //   address = locationMap.results[0]?.formatted_address;
    // }
    const data = {
      ...camp,
      people: [...list],
      numOfPeople: Math.floor(camp.numOfPeople),
      numOfPet: Math.floor(camp.numOfPet),
      location: {
        type: 'Point',
        'coordinates': [
          center.lng, center.lat
        ]
      },
      postcode:camp.postcode?.toString(), 
      // address: address
    }

    const res = await campsService.update(id, data);
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/manage-camps').then(() => {
        alertService.success('Camp was updated successful!')
      })
    }
  }

  return (
    <React.Fragment>
      {
        record && (
          <>
            {
              step === 1 && <AddNewCamp title='Edit Camp' zoom={zoom} setZoom={setZoom} center={center} setCenter={setCenter} onSubmit={onSubmit}/>
            }
            {
              step === 2 && <CampDetails defaultValues={campDetails} previousBack={previousBack} onSubmit={onSubmitCamp}/>
            }
            {
              step === 3 && <UnhousedInfo people={people} previousBack={previousBack} onSubmit={onSubmitUnhousedInfo}/>
            }
          </>
        )
      }
    </React.Fragment>
  );
};

export default EditCamp;
