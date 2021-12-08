import type { NextPage } from "next";
import styles from "styles/Home.module.scss";
import stylesComponent from "component/Component.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supplyItemsService, alertService, userService, suppliesService } from "services";
import Grid from "@mui/material/Grid";
import AlertDialog from "component/ConfirmationPopUp";
import Header from "component/Header";
import Table from "component/Table";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from 'component/Button';
import Select from 'component/Select';
import Container from '@mui/material/Container';
import Collapse from '@mui/material/Collapse';

const Index: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const updateQty = (qty: number, id: string) => {
    let _list = [...list];
    let objIndex = _list.findIndex((obj => obj.supplyId == id));
    _list[objIndex].qty = qty
    setList([..._list])
  }

  const [supplies, setSupplies] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const user = userService.userValue.user;
      const res = await supplyItemsService.list();
      const _res = await suppliesService.list();
      setOrganizationId(user.organizationId)
      const _list = res.items.map((i: any) => ({ supplyId: i.supplyId._id, qty: i.qty, name: i.supplyId.name }))
      setList([..._list]);
      setSupplies(_res.items.map((i: any) => ({ label: i.name, value: i._id})))
    };
    fetchData();
  }, []);

  const onSubmit = async () => {
    setLoading(true)
    console.log(list)
    const items = list.map((o: any) => ({supplyId: o.supplyId, qty: Math.floor(o.qty)}))
    const params = {
      organizationId: organizationId,
      supplyItems: items
    }
    const res = await supplyItemsService.createMany(params);

    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      alertService.success('Supply Item was updated successful!')
    }
    setLoading(false)
  }

  const [adding, setAdding] = useState(false)

  const openAddItem = () => {
    setAdding(!adding)
  }

  const onAddSupply = async (obj: any) => {
    const params = {
      ...obj,
      organizationId: organizationId
    }
    const res = await supplyItemsService.create(params);
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/supply-items/').then(() => {
        alertService.success('Supply Item was added successful!')
      })
    }
  }

  return (
    <main className={styles.mainTop}>
      <Header title="Manage Supply Items" back="/" />
      <Container maxWidth="sm" style={{margin: 'auto'}}>
        <Grid container className={'mt-2'}>
          <Grid className='text-center' item xs={6}>
            <b>Supply Item</b>
          </Grid>
          <Grid className='text-center' item xs={6}>
            <b>Quantity</b>
          </Grid>
          {
            list.map((obj: any, index: number) => (
              <SupplyItem key={index} obj={obj} updateQty={updateQty}/>
            ))
          }
          <Grid xs={12} item className='text-center' style={{ marginBottom: 15 }}>
            <a href='#' onClick={openAddItem}><b><u>Add Supply Item</u></b></a>
          </Grid>
          <Grid xs={12} item>
            <Collapse in={adding}>
              <NewItem list={list} supplies={supplies} onAddSupply={onAddSupply}/>
            </Collapse>
          </Grid>

          <Grid xs={12} item className='text-center' style={{paddingTop: 30}}>
            <Button text="Save" onClick={onSubmit} loading={loading}/>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default Index;

const NewItem = ({ list, supplies, onAddSupply }: any) => {
  const [supply, setSupply] = useState<any>();
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const onChangeSupply = (e: any) => {
    const item = list.find((o: any) => o.supplyId == e.value);
    if (item === undefined) {
      setSupply(e)
    } else {
      alertService.error('This item was existed')
    }
  }

  const onChangeQty = (e: any) => {
    if (e.target.value < 0) {
      setQuantity(0)
    } else {
      setQuantity(e.target.value)
    }
  }

  const onSubmit = () => {
    if(!supply) {
      alertService.error('Please select supply')
      return;
    }
    if(Math.floor(quantity) > 0) {
      onAddSupply({supplyId: supply.value, qty: Math.floor(quantity)})
    } else {
      alertService.error('Please input quantity greater 0')
    }
  }

  return (
    <Grid container spacing={2} style={{ margin: 'auto' }}>
      <Grid xs={6} item>
        <Select
          label=""
          placeholder=""
          options={supplies}
          value={supply}
          onChange={onChangeSupply}
        />
      </Grid>
      <Grid xs={6} item style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input value={quantity} min="0" onChange={onChangeQty} type='number' style={{ marginLeft: 10, marginRight: 10, width: 50 }}/>
      </Grid>
      <Grid xs={8} item className='text-center' style={{ paddingTop: 15, margin: 'auto' }}>
        <Button text="Add" onClick={onSubmit}/>
      </Grid>
    </Grid>
  )
}

const SupplyItem = ({obj, updateQty}: any) => {
  const [quantity, setQuantity] = useState<any>(obj.qty || 0)

  const handlePlus = () => {
    if (quantity >= 0) {
      setQuantity(quantity + 1)
    } else {
      setQuantity(0)
    }
  }
  const handleRemove = () => {
    if(quantity > 1) {
      setQuantity(quantity - 1)
    } else {
      setQuantity(0)
    }
  }

  const onChange = (e: any) => {
    if (e.target.value < 0) {
      setQuantity(0)
    } else {
      setQuantity(e.target.value)
    }
  }

  useEffect(() => {
    updateQty(quantity, obj.supplyId)
  }, [quantity])

  return (
    <Grid container spacing={2} style={{ marginTop: 10, marginBottom: 10, textAlign: 'center' }}>
      <Grid xs={6} item>
        {obj.name}
      </Grid>
      <Grid xs={6} item style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AddIcon className="cursor-pointer" fontSize="small" onClick={() => handlePlus()}/>
        <input value={quantity} min="0" onChange={onChange} type='number' style={{ marginLeft: 10, marginRight: 10, width: 50 }}/>
        <RemoveIcon className="cursor-pointer" fontSize="small" onClick={() => handleRemove()}/>
      </Grid>
    </Grid>
  )
}
