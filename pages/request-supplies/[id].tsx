import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import Box from '@mui/material/Box';
import { alertService, suppliesService, supplyItemsService,requestService } from 'services';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from "next/router";
import Collapse from '@mui/material/Collapse';
import Select from 'component/Select';

interface BasicTabsProps {
  supplies: any[];
  add: Function;
  remove: Function;
  requestSupplies: any[];
  updateQty: Function;
  options: any[]
}

const BasicTabs = ({ supplies, add, remove, requestSupplies, updateQty, options }: BasicTabsProps) => {
  const [_supplies, setSupplies] = useState<any[]>([])

  const [adding, setAdding] = useState(false)

  const openAddItem = () => {
    setAdding(!adding)
  }

  const addSupply = (obj: any) => {
    const _list = [..._supplies];
    _list.push(obj);
    setSupplies([..._list]);
    add(obj._id, obj.qty, obj.name)
    setAdding(false)
  }

  useEffect(() => {
    setSupplies([...supplies]);
  }, [supplies])

  const findSupply = (id: string) => {
    return requestSupplies?.find((obj: any) => obj.supplyId === id)
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
          _supplies.length > 0 && _supplies.map((sup: any, index: number) => (
            <SupplyItem  updateQty={updateQty} supply={findSupply(sup._id)} key={index} obj={sup} add={add} remove={remove}/>
          ))
        }
        <Grid xs={12} item className='text-center' style={{ marginBottom: 15, marginTop: 15 }}>
          <a href='#' onClick={openAddItem}><b><u>Add Supply Item</u></b></a>
        </Grid>
        <Grid xs={12} item>
          <Collapse in={adding}>
            <NewItem list={_supplies} addSupply={addSupply} supplies={options}/>
          </Collapse>
        </Grid>
    </Box>
  );
}

const SupplyItem = ({ obj, add, remove, supply, updateQty}: any) => {
  const [quantity, setQuantity] = useState<number>(supply ? supply.qty : 0)
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
  const [requestSupplies, setRequestSupplies] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    const res = await suppliesService.list();
    const data = await supplyItemsService.list();
    const items = data.items.map((i: any) => ({ _id: i.supplyId._id, name: i.supplyId.name, qty: i.qty}));
    setSupplies(items);
    setOptions(res.items.map((opt: any) => ({ label: opt.name, value: opt._id })))
  };
  const add = (id: string, quantity: number, name: string) => {
      setRequestSupplies([...requestSupplies, { supplyId: id, supplyName: name, qty: quantity }])
  }
  const onSubmit=async()=>{
    const res=await  requestService.createCamp({campId:id, supplies:requestSupplies});
    if(res._id){
      alertService.success('Request Supplies successful!');
      fetchData();
      setRequestSupplies([]);
    }
  }

  const remove = (id: string) => {
      const new_list = requestSupplies.filter((obj: any) => obj.supplyId !== id);
      setRequestSupplies([...new_list])
  }

  const updateQty = (qty: number, id: string) => {
      const _requestSupplies = [...requestSupplies];
      const objIndex = _requestSupplies.findIndex((obj => obj.supplyId == id));
      _requestSupplies[objIndex].qty = qty
      setRequestSupplies([..._requestSupplies])
  }

  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='Request supplies' back='/'/>
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <BasicTabs  updateQty={updateQty} requestSupplies={requestSupplies} add={add} remove={remove} supplies={supplies} options={options}/>
          <Button text="Submit" onClick={() => onSubmit()}/>
        </div>
      </Container>
    </main>
  )
}

export default Supplies;


const NewItem = ({ list, supplies, addSupply }: any) => {
  const [supply, setSupply] = useState<any>();
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const onAddSupply = async (obj: any) => {
    setLoading(true)
    setQuantity(0)
    setSupply(undefined)
    addSupply(obj)
    alertService.success('Supply Item was added successful!')
    setLoading(false)
  }

  const onChangeSupply = (e: any) => {
    const item = list.find((o: any) => o._id == e.value);
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
      onAddSupply({_id: supply.value, qty: Math.floor(quantity), name: supply.label})
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
        <Button text="Add" onClick={onSubmit} loading={loading}/>
      </Grid>
    </Grid>
  )
}
