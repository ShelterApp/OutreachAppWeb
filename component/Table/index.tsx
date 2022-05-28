import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

interface TableProps {
  list: any[];
  names: string[];
  cols: string[];
  edit?: Function;
  handleOpenAlert?: Function;
}

const Table = ({ list, names, cols, edit, handleOpenAlert }: TableProps) => {
  const getValue = (obj: any, name: string) => {
    const keys = name.split('.')
    let _obj = {...obj}
    
    keys.forEach(key => {
      _obj = _obj?_obj[key]:''
    })
    return _obj;
  }
  return (
    <div className="custom__table">
      <table>
        <thead>
          <tr>
            {
              cols.map((name: string, index: number) => (
                <th className="bg-white" key={index} scope="col">{name}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            list.map((obj: any, index: number) => (
              <tr className={index % 2 === 1 ? 'bg-white' : ''} key={index}>
                {
                  names.map((name: string, i: number) => {
                    if (name === "action") {
                      return (
                        <td data-label={cols[i]} key={i}>
                          <EditOutlinedIcon className="cursor-pointer me-2" fontSize="small" onClick={() => edit && edit(obj._id)}/>
                          <DeleteIcon className="cursor-pointer" fontSize="small" onClick={() => handleOpenAlert && handleOpenAlert(obj._id)}/>
                        </td>
                      )
                    }
                    const value = getValue(obj, name)
                    return <td data-label={cols[i]} key={i}>{value}</td>
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Table;
