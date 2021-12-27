import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import Box from '@mui/material/Box';
import { alertService, suppliesService, supplyItemsService,campsService } from 'services';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from "next/router";


interface BasicTabsProps {
  supplies: any[];
  supplyItems: any[];
  add: Function;
  remove: Function;
  dropSupplies: any[];
  updateQty: Function;
}

const BasicTabs = ({ supplyItems, supplies, add, remove,  dropSupplies,  updateQty }: BasicTabsProps) => {

  const findSupply = (id: string) => {
      return dropSupplies?.find((obj: any) => obj.supplyId === id)
  }

  return (
    <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            Supply Item
          </Grid>
          <Grid item xs={6}>
            Quantity
          </Grid>
        </Grid>
        <br/>
        {
          supplyItems.length > 0 && supplyItems.map((sup: any, index: number) => (
            <SupplyItem tab='dropSupplies' updateQty={updateQty} supply={findSupply(sup._id)} key={index} obj={sup} add={add} remove={remove}/>
          ))
        }
    </Box>
  );
}

const SupplyItem = ({tab, obj, add, remove, supply, updateQty}: any) => {
  const [quantity, setQuantity] = useState<any>(supply ? supply.qty : 0)
  const handlePlus = () => {
    if (quantity >= 0) {
      if(tab === 'dropSupplies') {
        if(quantity + 1 > obj.qty) {
          alertService.error(`${obj.name} don't have enough quantity`)
          return;
        }
      }
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

  useEffect(() => {
    supply && updateQty(quantity, obj._id)
    if (quantity > 0 && !checked) {
      onCheck(true)
    } else if (quantity == 0 && checked) {
      onCheck(false)
    }
  }, [quantity])

  const [checked, setChecked] = useState<boolean>(supply ? true : false)
  const onCheck = (b: boolean) => {
    setChecked(b)
    if(b) {
      add(obj._id, quantity, obj.name)
    } else {
      remove(obj._id)
    }
  }

  return (
    <Grid container spacing={2} style={{ borderBottom: '1px solid gray'}}>
      <Grid item xs={6}>
        <FormControlLabel control={<Checkbox checked={checked} onChange={(e) => onCheck(e.target.checked)} />} label={obj.name} />
      </Grid>
      <Grid item xs={6} style={{display: 'flex', alignItems: 'center' }}>
        <RemoveIcon className="cursor-pointer" fontSize="small" onClick={() => handleRemove()}/>
        <div style={{ marginLeft: 10, marginRight: 10 }}>
          { quantity }
        </div>
        <AddIcon className="cursor-pointer" fontSize="small" onClick={() => handlePlus()}/>
      </Grid>
    </Grid>
  )
}

const Supplies = () => {
  const router = useRouter();
  const { id } = router.query;
  const [supplies, setSupplies] = useState<any[]>([]);
  const [supplyItems, setSupplyItems] = useState<any[]>([]);
  const [dropSupplies, setDropSupplies] = useState<any[]>([]);
  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    const res = await suppliesService.list();
    const data = await supplyItemsService.list();
    const items = data.items.map((i: any) => ({ _id: i.supplyId._id, name: i.supplyId.name, qty: i.qty}));
    setSupplyItems(items);
    setSupplies(res.items);
  };

  const add = (id: string, quantity: number, name: string) => {
      setDropSupplies([...dropSupplies, { supplyId: id, supplyName: name, qty: quantity }])
  }
  const onSubmit=async()=>{
    const res=await  campsService.dropSupply(id,{supplies:dropSupplies});
    if(res._id){
      alertService.success('Drop Supplies successful!');
      fetchData();
      setDropSupplies([]);
    }
  }

  const remove = (id: string) => {
      const new_list = dropSupplies.filter((obj: any) => obj.id !== id);
      setDropSupplies([...new_list])
  }

  const updateQty = (qty: number, id: string) => {
      const _dropSupplies = [...dropSupplies];
      const objIndex = _dropSupplies.findIndex((obj => obj.supplyId == id));
      _dropSupplies[objIndex].qty = qty
      setDropSupplies([..._dropSupplies])
  }

  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='Drop supplies' back='/'/>
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <BasicTabs  updateQty={updateQty} dropSupplies={dropSupplies} add={add} remove={remove} supplyItems={supplyItems} supplies={supplies}/>
          <Button text="Submit" onClick={() => onSubmit()}/>
        </div>
      </Container>
    </main>
  )
}

export default Supplies;
